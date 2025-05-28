import { configure, wrap } from "agentql";
import { NEXT_PAGE_PROMPT } from "./config";
import { chromium } from "playwright";
import dotenv from "dotenv";

dotenv.config();

// Load API keys from environment variable
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

// Main function to run
export async function scrapeMultipleLinksUsingWebsocket({
  urls,
  query,
  maxPages = 1,
}: {
  urls: string[];
  query: string;
  maxPages?: number;
}) {
  let scrapedData: any[] = [];
  try {
    configure({ apiKey: getCurrentApiKey() });

    // Connect to the specific page via Chrome DevTools Protocol
    if (!process.env.WEBSOCKET_URL) {
      throw new Error("WEBSOCKET_URL environment variable is not defined");
    }
    const browser = await chromium.connectOverCDP(process.env.WEBSOCKET_URL as string);

    // Get the existing context and pages
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();

    // Use the first existing page instead of creating a new one
    const existingPage = pages[0];
    const page = await wrap(existingPage);

    console.log("Current page URL:", await page.url());

    // Navigate to Yelp if not already there
    const currentUrl = await page.url();
    for (const url of urls) {
      let retries = maxRetries;
      let success = false;

      while (retries > 0 && !success) {
        console.log(getCurrentApiKey());
        try {
          console.log(
            `Scraping URL ${urls.indexOf(url) + 1} of ${urls.length} (Attempt ${
              maxRetries - retries + 1
            })`
          );
          if (currentUrl !== url) {
            console.log("Navigating...");
            await page.goto(url);
          }

          let currentPage = 1;
          while (currentPage <= maxPages) {
            console.log(`Scraping data from ${url} page ${currentPage}...`);

            const data = await page.queryData(query);
            if (data && Object.keys(data).length > 0) {
              console.log(`Data found on page ${currentPage}`);
              scrapedData.push(data);
            } else {
              console.log("No data found on this page, stopping pagination");
              break;
            }

            if (currentPage >= maxPages) {
              break;
            }
          }
          success = true; // Mark as successful if scraping completes without errors
        } catch (error: any) {
          console.error(`Error scraping URL ${url}:`, error);
          retries--;
          if (retries > 0) {
            console.log(`Retrying URL ${url} with a new API key...`);
            rotateApiKey();
            configure({ apiKey: getCurrentApiKey() });
          } else {
            console.error(
              `All retries exhausted for URL ${url}. Moving to the next URL.`
            );
          }
        }
      }
    }

    return scrapedData;
  } catch (error) {
    console.error("Error in main function:", error);
    return scrapedData;
  }
}
