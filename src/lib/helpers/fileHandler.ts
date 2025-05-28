import * as fs from "fs";
import * as path from "path";

export function loadJsonFile(fileName: string) {
  const filePath = path.join(fileName);

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(fileContent);
    console.log(
      `Loaded ${
        Array.isArray(parsedData) ? parsedData.length : 0
      } items from JSON file`
    );
    return parsedData;
  } else {
    console.error(`JSON file not found. Please ensure '${fileName}' exists.`);
    return null;
  }
}

export function saveToFile(fileName: string, data: any) {
  const filePath = `${fileName}.json`;

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Scraped data saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to save data to ${filePath}:`, error);
  }
}

export function combineAndSaveJsonFiles(
  jsonFilePaths: string[],
  outputFileName: string
) {
  const combinedArray = [];
  for (const filePath of jsonFilePaths) {
    const data = loadJsonFile(filePath);
    if (Array.isArray(data)) {
      combinedArray.push(...data);
    }
  }
  saveToFile(outputFileName, combinedArray);
  console.log(
    `Combined ${jsonFilePaths.length} JSON files into a single file: ${outputFileName}.json`
  );
}
