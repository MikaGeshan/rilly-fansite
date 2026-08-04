#!/usr/bin/env python3
import argparse
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from typing import Any
from urllib.parse import urlencode

import cloudscraper
import requests

try:
    from curl_cffi import requests as curl_requests
except ImportError:
    curl_requests = None


BASE_URL = "https://jkt48.com/api/v1"
MEMBER_ID = 39
TIMEOUT_SECONDS = 15
HEADERS = {
    "Accept": "application/json",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Referer": "https://jkt48.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
}
SCRAPER = cloudscraper.create_scraper(
    interpreter='nodejs',
    browser={
        'browser': 'chrome',
        'platform': 'windows',
        'desktop': True
    }
)


class UpstreamError(RuntimeError):
    def __init__(self, message: str, status: int | None = None) -> None:
        super().__init__(message)
        self.status = status


def read_json(path: str) -> Any:
    url = f"{BASE_URL}{path}"

    # Try using curl_cffi first as it successfully bypasses Cloudflare TLS fingerprinting
    if curl_requests is not None:
        try:
            response = curl_requests.get(
                url,
                headers=HEADERS,
                timeout=TIMEOUT_SECONDS,
                impersonate="chrome"
            )
            if response.status_code == 200:
                content_type = response.headers.get("content-type", "")
                if "application/json" in content_type:
                    return response.json()
                raise UpstreamError(
                    f"Expected JSON from {path}, got {content_type or 'unknown content type'}",
                    response.status_code,
                )
            elif response.status_code != 403:
                # If it's a non-403 error (e.g. 404 or 500), raise it
                raise UpstreamError(
                    f"JKT48 official API rejected {path}: {response.status_code} {response.reason}",
                    response.status_code,
                )
        except UpstreamError:
            raise
        except Exception:
            # Fallback to cloudscraper for other request exceptions
            pass

    # Fallback to cloudscraper
    try:
        response = SCRAPER.get(url, headers=HEADERS, timeout=TIMEOUT_SECONDS)
        if not response.ok:
            challenge = response.headers.get("cf-mitigated") == "challenge"
            reason = "Cloudflare challenge" if challenge else response.reason
            raise UpstreamError(
                f"JKT48 official API rejected {path}: {response.status_code} {reason}",
                response.status_code,
            )

        content_type = response.headers.get("content-type", "")
        if "application/json" not in content_type:
            raise UpstreamError(
                f"Expected JSON from {path}, got {content_type or 'unknown content type'}",
                response.status_code,
            )

        return response.json()
    except requests.exceptions.RequestException as error:
        status_code = None
        if error.response is not None:
            status_code = error.response.status_code
        raise UpstreamError(
            f"Could not reach JKT48 official API: {error}",
            status_code,
        ) from error


def read_show(code: str) -> dict[str, Any] | None:
    try:
        response = read_json(f"/theater-shows/{code}?lang=id")
    except UpstreamError as error:
        print(f"[jkt48-python] show fetch failed code={code} error={error}", file=sys.stderr)
        return None

    data = response.get("data") if isinstance(response, dict) else None
    return data if isinstance(data, dict) else None


def fetch_schedule(month: str, year: str) -> dict[str, Any]:
    params = urlencode(
        {
            "lang": "id",
            "month": month,
            "year": year,
            "type": "show",
        }
    )
    schedules_response = read_json(f"/schedules?{params}")
    schedules_data = schedules_response.get("data") if isinstance(schedules_response, dict) else []
    schedules = schedules_data if isinstance(schedules_data, list) else []
    codes = [
        show.get("reference_code")
        for show in schedules
        if isinstance(show, dict) and isinstance(show.get("reference_code"), str)
    ]

    with ThreadPoolExecutor(max_workers=6) as executor:
        shows = [show for show in executor.map(read_show, codes) if show is not None]

    filtered_shows = [
        show
        for show in shows
        if any(
            member.get("member_id") == MEMBER_ID
            for member in show.get("jkt48_member", [])
            if isinstance(member, dict)
        )
    ]

    return {
        "source": "jkt48-official-python",
        "month": month,
        "year": year,
        "member_id": MEMBER_ID,
        "count": len(filtered_shows),
        "shows": filtered_shows,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", required=True)
    parser.add_argument("--year", required=True)
    args = parser.parse_args()

    try:
        print(json.dumps(fetch_schedule(args.month, args.year), ensure_ascii=False))
        return 0
    except UpstreamError as error:
        print(
            json.dumps(
                {
                    "source": "jkt48-official-python",
                    "ok": False,
                    "error": str(error),
                    "status": error.status,
                },
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
