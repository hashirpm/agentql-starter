import {
  ACCEPT_LANGUAGES,
  BROWSER_ARGS,
  BROWSER_IGNORED_ARGS,
  LOCATIONS,
  NEXT_PAGE_PROMPT,
  PROXIES,
  REFERERS,
  USER_AGENTS,
} from "./config";

import { chromium } from "playwright";
import { wrap, configure } from "agentql";
import { randomInt } from "crypto";
import dotenv from "dotenv";

dotenv.config();

let apiKeys = (process.env.AGENTQL_API_KEYS ?? "").split(",");
let currentKeyIndex = 0;
const maxRetries = process.env.AGENTQL_API_KEYS?.length || 5; // Maximum retries per URL

// Function to get the current API key
function getCurrentApiKey() {
  if (apiKeys.length === 0 || !apiKeys[currentKeyIndex]) {
    throw new Error("No valid API key available");
  }
  return apiKeys[currentKeyIndex];
}

// Function to rotate to the next API key
function rotateApiKey() {
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
}
export async function scrapeWebsite({
  url,
  query,
  maxPages = 1,
}: {
  url: string;
  query: string;
  maxPages?: number;
}): Promise<any[]> {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  const headerDNT = Math.random() > 0.5 ? "0" : "1";
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const referer = REFERERS[Math.floor(Math.random() * REFERERS.length)];
  const acceptLanguage =
    ACCEPT_LANGUAGES[Math.floor(Math.random() * ACCEPT_LANGUAGES.length)];
  const proxy =
    PROXIES.length > 0
      ? PROXIES[Math.floor(Math.random() * PROXIES.length)]
      : null;

  const browser = await chromium.launch({
    headless: false,
    args: BROWSER_ARGS,
    ignoreDefaultArgs: BROWSER_IGNORED_ARGS,
  });

  const context = await browser.newContext({
    proxy: proxy ?? undefined,
    locale: "en-US,en,ru",
    timezoneId: typeof location[0] === "string" ? location[0] : undefined,
    extraHTTPHeaders: {
      "Accept-Language": acceptLanguage,
      Referer: referer,
      DNT: headerDNT,
      Connection: "keep-alive",
      "Accept-Encoding": "gzip, deflate, br",
    },
    geolocation: typeof location[1] === "object" ? location[1] : undefined,
    userAgent: userAgent,
    permissions: ["notifications"],
    viewport: {
      width: 1920 + randomInt(-50, 50),
      height: 1080 + randomInt(-50, 50),
    },
  });
  configure({ apiKey: getCurrentApiKey() });

  // Configure AgentQL with your API key

  const page = await wrap(await context.newPage());

  let scrapedData: any[] = [];

  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { referer });

    let currentPage = 1;

    while (currentPage <= maxPages) {
      console.log(`Scraping data from page ${currentPage}...`);
      let retries = maxRetries;
      let success = false;

      while (retries > 0 && !success) {
        try {
          const data = await page.queryData(query);

          if (data && Object.keys(data).length > 0) {
            console.log(`Data found on page ${currentPage}`);
            scrapedData = [...scrapedData, ...Object.values(data)];
            success = true;
          } else {
            console.log("No data found on this page, stopping pagination");
            success = true;
            break;
          }
        } catch (error: any) {
          console.error(`Error scraping URL ${url}:`, error);
          retries--;
          if (retries > 0) {
            console.log(`Retrying URL ${url} with a new API key...`);
            rotateApiKey();
            configure({ apiKey: getCurrentApiKey() });
          } else {
            console.error(
              `All retries exhausted for URL ${url}. Moving to the next page.`
            );
            break; // Exit retry loop and move to next page
          }
        }
      }
      if (!success) {
        console.log("Failed to scrape current page after all retries");
        break;
      }

      if (currentPage >= maxPages) {
        break;
      }

      try {
        const nextPageButton = await page.getByPrompt(NEXT_PAGE_PROMPT);

        if (nextPageButton) {
          console.log("Navigating to next page...");
          await nextPageButton.click();
          await page.waitForLoadState();
          currentPage++;
        } else {
          console.log("No next page button found, reached the end of results");
          break;
        }
      } catch (error) {
        console.log("Could not navigate to next page, stopping pagination");
        break;
      }
    }
  } catch (error) {
    console.error("Error scraping website:", error);
  } finally {
    await browser.close();
  }

  return scrapedData;
}
