import { scrapeMultipleLinksUsingWebsocket } from "../../agent-ql/multiple";
import { scrapeUsingWebsocket } from "../../agent-ql/websocket";
import { LIST_QUERY } from "../query";
import { extractAttributeValues } from "./extractLinks";
import { loadJsonFile, saveToFile } from "./fileHandler";

export function processAndSaveExtractedUrls(
  inputFileName: string,
  outputFileName: string,
  attributeKey: string
): void {
  const jsonData = loadJsonFile(inputFileName);
  if (!jsonData) {
    console.error(`Failed to load data from ${inputFileName}.`);
    return;
  }
  const extractedValues = extractAttributeValues(jsonData, attributeKey);
  saveToFile(outputFileName, extractedValues);
  console.log(`Extracted values saved to ${outputFileName}.json`);
}

export async function scrapeAndSaveData(
  outputFileName: string,
  websiteUrl: string,
  query:string,
  maxPages:number
): Promise<void> {
  try {
    const scrapedData = await scrapeUsingWebsocket({
      url: websiteUrl,
      query: query,
      maxPages: maxPages,
    });
    console.log({ scrapedData });
    if (scrapedData.length > 0) {
      saveToFile(outputFileName, scrapedData);
      console.log(`Scraped data saved to ${outputFileName}.json successfully.`);
    } else {
      console.log("No data scraped.");
    }
  } catch (error) {
    console.error("An error occurred during scraping:", error);
  }
}

export async function scrapeAndSaveMultiple(
    inputFileName: string,
    outputFileNamePrefix: string,
    query: string,
    maxPages: number,
    sliceStart: number,
    sliceLimit: number
): Promise<void> {
    const allLinks = loadJsonFile(inputFileName);
    if (!allLinks) {
        console.error(`Failed to load links from ${inputFileName}.`);
        return;
    }
    console.log(`Loaded ${allLinks.length} links from ${inputFileName}.`);

    try {
        const scrapedData = await scrapeMultipleLinksUsingWebsocket({
            urls: allLinks.slice(sliceStart, sliceLimit),
            query,
            maxPages,
        });

        if (scrapedData.length > 0) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const fileName = `${outputFileNamePrefix}_${timestamp}`;
            saveToFile(fileName, scrapedData);
            console.log(`Scraped data saved to ${fileName}.json successfully.`);
        } else {
            console.log("No data scraped.");
        }
    } catch (error) {
        console.error("An error occurred during scraping:", error);
    }
}
