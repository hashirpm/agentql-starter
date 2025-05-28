import { NEXT_PAGE_PROMPT } from "./config";
import dotenv from "dotenv";
import { chromium } from "playwright";
import { configure, wrap } from "agentql";

dotenv.config();
// Load API keys from environment variable
let apiKeys = (process.env.AGENTQL_API_KEYS ?? "").split(",");
let currentKeyIndex = 0;
const maxRetries = 3; // Maximum retries per URL

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
export async function scrapeUsingWebsocket({
  url,
  query,
  maxPages = 1,
}: {
  url: string;
  query: string;
  maxPages?: number;
}) {
  let scrapedData: any[] = [];
  try {
    console.log("Starting to scrape:", url);
    configure({ apiKey: getCurrentApiKey() });
    // Connect to the specific page via Chrome DevTools Protocol
    if (!process.env.WEBSOCKET_URL) {
      throw new Error("WEBSOCKET_URL environment variable is not defined");
    }
    const browser = await chromium.connectOverCDP(
      process.env.WEBSOCKET_URL as string
    );

    // Get the existing context and pages
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();

    // Use the first existing page instead of creating a new one
    const existingPage = pages[0];
    const page = await wrap(existingPage);

    console.log("Current page URL:", await page.url());

    // Navigate to target URL if not already there
    const currentUrl = await page.url();
    if (currentUrl !== url) {
      console.log("Navigating to target URL...");
      await page.goto(url);
    }

    let currentPage = 1;

    while (currentPage <= maxPages) {
      console.log(`Current page: ${currentPage}, Max pages: ${maxPages}`);
      let retries = maxRetries;
      let success = false;

      while (retries > 0 && !success) {
        try {
          console.log(`Scraping data from page ${currentPage}...`);

          const data = await page.queryData(query);

          if (data && Object.keys(data).length > 0) {
            console.log(`Data found on page ${currentPage}`);
            scrapedData = [...scrapedData, ...Object.values(data).flat()];
            success = true; // Mark as successful after data is scraped
          } else {
            console.log("No data found on this page, stopping pagination");
            success = true; // Still mark as successful to avoid retries
            break; // Exit the page loop entirely
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

      // If scraping failed after all retries, break out of page loop
      if (!success) {
        console.log("Failed to scrape current page after all retries");
        break;
      }

      // Only try to navigate to next page if we haven't reached maxPages
      if (currentPage >= maxPages) {
        break;
      }

      // Try to navigate to next page
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

    return scrapedData;
  } catch (error) {
    console.error("Error in main function:", error);
    return scrapedData; // Return whatever data was collected before the error
  }
}
