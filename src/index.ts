import dotenv from "dotenv";
import { DETAILED_QUERY, LIST_QUERY } from "./lib/query";
import {
  processAndSaveExtractedUrls,
  scrapeAndSaveData,
  scrapeAndSaveMultiple,
} from "./lib/helpers/scrapeHelper";

import { TRIP_ADVISOR_CAFE_BASE_URL } from "./lib/const";

dotenv.config();

async function main() {
  console.log("Starting the web scraping process...");

  await scrapeAndSaveData(
    "tripadvisor_home",
    TRIP_ADVISOR_CAFE_BASE_URL,
    LIST_QUERY,
    1
  );

  processAndSaveExtractedUrls(
    "tripadvisor_home",
    "tripadvisor_links",
    "tripadvisor_detailed_link"
  );

  await scrapeAndSaveMultiple(
    "tripadvisor_cafe_links.json",
    "tripadvisor_cafe_data",
    DETAILED_QUERY,
    1,
    0,
    50
  );

  console.log("Scraping process finished.");
  return;
}

main().catch((error) => {
  console.error("Error in main function:", error);
  process.exit(1);
});
