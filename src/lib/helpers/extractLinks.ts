export function extractAttributeValues(data:Record<string, any>[], attributeName:string) {
  return data
    .map((item) => item[attributeName])
    .filter((value) => value !== undefined && value !== null);
}

