const fs = require("fs");
const path = require("path");
const axios = require("axios");

const INSTAGRAM_USERNAME = "rilly.jkt48_";
const OUTPUT_FILE = path.join(__dirname, "../public/data/media.json");
const IMAGE_DIR = path.join(__dirname, "../public/images/instagram");

// Optional feed URL (e.g. from RSS.app, FetchRSS, or custom proxy) that handles slides automatically.
// The free tier of RSS.app is 100% free and supports full carousel slide extraction.
const INSTAGRAM_FEED_URL = process.env.INSTAGRAM_FEED_URL || "";

// List of public Instagram web viewer mirrors to try in sequence
const MIRRORS = [
  {
    url: `https://imginn.com/${INSTAGRAM_USERNAME}/`,
    detailUrl: (mediaId) => `https://imginn.com/p/${mediaId}/`,
    parser: parseImginn,
    detailParser: parseImginnDetails,
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function decodeHtmlEntities(str) {
  return str
    .replace(/&#38;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function parseImginn(html) {
  const mediaPosts = [];
  const postRegex = /<div class="item">([\s\S]*?)<\/div>/g;
  let match;
  let count = 0;

  while ((match = postRegex.exec(html)) !== null && count < 24) {
    const cardHtml = match[1];
    const imgMatch = cardHtml.match(/src="([^"]+)"/);
    const linkMatch = cardHtml.match(/href="\/p\/([^"/]+)\/"/);

    if (imgMatch && linkMatch) {
      const rawSrc = imgMatch[1];
      const mediaId = linkMatch[1];
      const instagramLink = `https://www.instagram.com/p/${mediaId}/`;

      // Skip template placeholders
      if (mediaId.includes("{") || rawSrc.includes("{")) continue;

      mediaPosts.push({
        id: `ig-${mediaId}`,
        src: decodeHtmlEntities(rawSrc),
        link: instagramLink,
        mediaId: mediaId,
      });
      count++;
    }
  }
  return mediaPosts;
}

// Parses the detail page of a post to find all images (slides/carousel)
function parseImginnDetails(html) {
  const imageUrls = [];
  const imgRegex = /<img[^>]+src="([^"]+?)"/g;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const src = decodeHtmlEntities(match[1]);

    // Validate that it's a post media image and not an avatar or placeholder
    if (
      src.includes("imginn.com") &&
      !src.includes("avatar") &&
      !imageUrls.includes(src)
    ) {
      imageUrls.push(src);
    }
  }

  return imageUrls;
}

async function downloadImage(url, filename) {
  if (!url || !url.startsWith("http")) {
    console.error(`[!] Invalid image URL: ${url}`);
    return false;
  }
  const filePath = path.join(IMAGE_DIR, filename);
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.google.com/",
      },
      timeout: 8000,
    });
    fs.writeFileSync(filePath, response.data);
    return true;
  } catch (err) {
    console.error(`[!] Error downloading image ${url}: ${err.message}`);
    return false;
  }
}

async function fetchPostSlides(mirror, mediaId, fallbackSrc, cookieHeader) {
  // Attempt to fetch slides from Instagram's native public embed URL
  const embedUrl = `https://www.instagram.com/p/${mediaId}/embed/captioned/`;
  try {
    console.log(`[*] Fetching slides for post ${mediaId} from Instagram Embed: ${embedUrl}`);
    const response = await axios.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Mode': 'navigate'
      },
      timeout: 10000
    });

    const html = response.data;
    
    // Find script tag containing shortcode_media
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
    let match;
    let targetScript = "";
    while ((match = scriptRegex.exec(html)) !== null) {
      if (match[1].includes('shortcode_media')) {
        targetScript = match[1];
        break;
      }
    }

    if (targetScript) {
      const startKey = '"contextJSON":"';
      const startIdx = targetScript.indexOf(startKey);
      if (startIdx !== -1) {
        const jsonStart = startIdx + startKey.length;
        let jsonEnd = -1;
        
        for (let i = jsonStart; i < targetScript.length; i++) {
          if (targetScript[i] === '"') {
            let backslashCount = 0;
            for (let j = i - 1; j >= jsonStart; j--) {
              if (targetScript[j] === '\\') {
                backslashCount++;
              } else {
                break;
              }
            }
            if (backslashCount % 2 === 0) {
              jsonEnd = i;
              break;
            }
          }
        }

        if (jsonEnd !== -1) {
          const escapedJson = targetScript.slice(jsonStart, jsonEnd);
          const unescapedJson = JSON.parse(`"${escapedJson}"`);
          const parsedData = JSON.parse(unescapedJson);
          
          const media = parsedData.gql_data.shortcode_media;
          if (media) {
            const slideUrls = [];
            if (media.edge_sidecar_to_children && media.edge_sidecar_to_children.edges) {
              const edges = media.edge_sidecar_to_children.edges;
              edges.forEach(edge => {
                if (edge.node && edge.node.display_url) {
                  slideUrls.push(edge.node.display_url);
                }
              });
            } else if (media.display_url) {
              slideUrls.push(media.display_url);
            }

            if (slideUrls.length > 0) {
              console.log(`[+] Successfully retrieved ${slideUrls.length} slides for post ${mediaId} via Instagram Embed.`);
              return slideUrls;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[!] Failed fetching post slides for ${mediaId} via Instagram Embed: ${err.message}`);
  }

  // Fallback to Imginn mirror detail page if native embed fetch fails (staggered try)
  if (mirror && mirror.detailUrl && mirror.detailParser) {
    const detailUrl = mirror.detailUrl(mediaId);
    try {
      console.log(`[*] Falling back to mirror detail page for post ${mediaId}: ${detailUrl}`);
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: mirror.url,
        "Cache-Control": "no-cache",
      };

      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await axios.get(detailUrl, {
        headers,
        timeout: 8000,
      });

      const urls = mirror.detailParser(response.data);
      if (urls.length > 0) {
        console.log(`[+] Found ${urls.length} slides for post ${mediaId} via Mirror.`);
        return urls;
      }
    } catch (err) {
      console.warn(
        `[!] Failed fetching post slides for ${mediaId} via Mirror fallback: ${err.message}`,
      );
    }
  }

  return [fallbackSrc]; // Ultimate fallback to cover image if both fail
}

async function fetchFromFeed(feedUrl) {
  console.log(
    `[*] Fetching media from configured Instagram RSS/JSON feed: ${feedUrl}`,
  );
  try {
    const response = await axios.get(feedUrl, { timeout: 12000 });
    const data = response.data;

    let items = [];
    if (data && Array.isArray(data.items)) {
      items = data.items;
    } else if (
      data &&
      data.rss &&
      data.rss.channel &&
      Array.isArray(data.rss.channel.item)
    ) {
      items = data.rss.channel.item;
    } else if (Array.isArray(data)) {
      items = data;
    }

    const posts = [];
    for (const item of items) {
      const guid = item.id || item.guid || `ig-feed-${Date.now()}`;
      // Remove query string to extract a clean media ID
      const link = item.url || item.link || item.external_url || "";
      const match = link.match(/\/p\/([^/]+)/);
      const mediaId = match ? match[1] : guid;
      const instagramLink = `https://www.instagram.com/p/${mediaId}/`;

      // Extract all image attachments (slides/carousel)
      const slides = [];

      // JSON Feed standard attachments
      if (Array.isArray(item.attachments)) {
        item.attachments.forEach((att) => {
          if (
            att.url &&
            (att.mime_type?.startsWith("image") ||
              att.url.includes(".jpg") ||
              att.url.includes(".png"))
          ) {
            slides.push(decodeHtmlEntities(att.url));
          }
        });
      }

      // Check main image
      const mainImg = item.image || item.banner_image;
      if (mainImg) {
        const cleanMain = decodeHtmlEntities(mainImg);
        if (!slides.includes(cleanMain)) slides.unshift(cleanMain);
      }

      // If no attachments found, try content HTML extraction
      if (slides.length === 0 && (item.content_html || item.description)) {
        const html = item.content_html || item.description || "";
        const imgRegex = /<img[^>]+src="([^"]+?)"/g;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(html)) !== null) {
          const src = decodeHtmlEntities(imgMatch[1]);
          if (!slides.includes(src)) slides.push(src);
        }
      }

      if (slides.length > 0) {
        posts.push({
          id: `ig-${mediaId}`,
          mediaId,
          link: instagramLink,
          slides: slides,
        });
      }
    }
    return posts;
  } catch (err) {
    console.error(`[!] Failed fetching from RSS/JSON feed: ${err.message}`);
    return [];
  }
}

async function main() {
  // Ensure directories exist
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

  let parsedPosts = []; // Structure: { id, mediaId, link, slides: [url1, url2...] }

  // Check if a feed URL is configured
  if (INSTAGRAM_FEED_URL) {
    parsedPosts = await fetchFromFeed(INSTAGRAM_FEED_URL);
  }

  // Fallback to Profile Scraper if Feed is empty or not configured
  if (parsedPosts.length === 0) {
    console.log("[*] Using public profile viewer mirror fallback...");
    let rawPosts = [];
    let selectedMirror = null;
    let cookieHeader = "";

    for (const mirror of MIRRORS) {
      try {
        let nextCursor = "";
        let page = 1;
        const maxPages = 4; // 12 posts per page * 4 pages = 48 posts (covers all 46 posts!)
        selectedMirror = mirror;

        while (page <= maxPages) {
          const cursorParam = nextCursor ? `?next=${nextCursor}` : "";
          const profilePageUrl = `${mirror.url}${cursorParam}`;
          
          console.log(`[*] Fetching Instagram profile (Page ${page}) from: ${profilePageUrl}`);
          const response = await axios.get(profilePageUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
              Referer: "https://www.google.com/",
              "Cache-Control": "no-cache",
            },
            timeout: 10000,
          });

          const parsed = mirror.parser(response.data);
          if (parsed.length > 0) {
            // Prevent duplicates
            parsed.forEach(post => {
              if (!rawPosts.some(p => p.mediaId === post.mediaId)) {
                rawPosts.push(post);
              }
            });
            console.log(`[+] Found ${parsed.length} posts on page ${page}. Cumulative unique: ${rawPosts.length}`);

            if (!cookieHeader) {
              const cookies = response.headers["set-cookie"] || [];
              cookieHeader = cookies.map((c) => c.split(";")[0]).join("; ");
            }

            // Search for next page cursor in HTML
            const nextMatch = response.data.match(/\?next=([\w\d]+)/);
            if (nextMatch) {
              nextCursor = nextMatch[1];
              console.log(`[+] Found next page pagination cursor: ${nextCursor}`);
              page++;
              await sleep(2000); // Cooldown sleep to prevent rate limiting
            } else {
              console.log("[*] No pagination cursor found in HTML. Scraped all available pages.");
              break;
            }
          } else {
            console.log("[*] Scraped 0 posts on this page. Stopping pagination.");
            break;
          }
        }

        if (rawPosts.length > 0) {
          console.log(`[+] Successfully retrieved ${rawPosts.length} total posts from mirror.`);
          break; // Stop checking other mirrors if this one succeeded
        }
      } catch (err) {
        console.warn(`[!] Mirror ${mirror.url} page loop failed: ${err.message}`);
      }
    }

    // Convert raw posts to sliding structure
    for (const post of rawPosts) {
      // Fetch slides from detail page (Imginn may rate limit 429/403)
      await sleep(1500);
      const slides = await fetchPostSlides(
        selectedMirror,
        post.mediaId,
        post.src,
        cookieHeader,
      );

      parsedPosts.push({
        id: post.id,
        mediaId: post.mediaId,
        link: post.link,
        slides: slides,
      });
    }
  }

  const finalMedia = [];

  // Download all slide images in parallel per post to improve performance dramatically
  for (const post of parsedPosts) {
    const slides = post.slides || [];
    const downloadPromises = slides.map(async (srcUrl, i) => {
      const suffix = slides.length > 1 ? `_slide_${i + 1}` : "";
      const filename = `${post.mediaId}${suffix}.jpg`;

      console.log(
        `[*] Downloading image ${i + 1}/${slides.length} for post ${post.mediaId}...`,
      );
      const success = await downloadImage(srcUrl, filename);

      if (success) {
        return {
          id: `${post.id}${suffix}`,
          src: `/images/instagram/${filename}`, // Local reference inside public/
          link: post.link,
          source: "instagram",
          date: new Date().toISOString(),
        };
      } else {
        console.warn(
          `[!] Skipping slide ${i + 1} of post ${post.mediaId} because image download failed.`,
        );
        return null;
      }
    });

    const results = await Promise.all(downloadPromises);
    results.forEach(res => {
      if (res) finalMedia.push(res);
    });
  }

  // PRODUCTION SAFETY CHECK: If no media items were fetched (e.g. rate limit / network error),
  // do not overwrite the existing media.json file with an empty array. This prevents the website
  // gallery from displaying blank if the scraper has a temporary network issue.
  if (finalMedia.length === 0) {
    console.warn(
      "\n[⚠️] PRODUCTION WARNING: Scraper returned 0 posts. Skipping file write to preserve the existing media catalog.",
    );
    return;
  }

  // Save the result static file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalMedia, null, 2), "utf-8");
  console.log(
    `\n[🎉] Done! Saved ${finalMedia.length} total media items (including slides) to ${OUTPUT_FILE}`,
  );
}

main().catch((err) => {
  console.error("Critical error in scraper:", err);
  process.exit(1);
});
