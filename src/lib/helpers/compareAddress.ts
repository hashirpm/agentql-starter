export async function areAddressesSame(
  address1: string,
  address2: string
): Promise<boolean> {
  try {
    const url1 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      normalizeAddress(address1)
    )}&format=json&limit=1`;
    const url2 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      normalizeAddress(address2)
    )}&format=json&limit=1`;
    // console.log(url1);
    // console.log(url2);
    const [response1, response2] = await Promise.all([
      fetch(url1, { headers: { "User-Agent": "AddressChecker/1.0" } }).then(
        (res) => res.json()
      ),
      fetch(url2, { headers: { "User-Agent": "AddressChecker/1.0" } }).then(
        (res) => res.json()
      ),
    ]);

    if (!response1[0] || !response2[0]) {
      return false; // One or both addresses not found
    }
    console.log("response1");
    console.log(response1[0]);
    console.log("response2");
    console.log(response2[0]);
    return response1[0].place_id === response2[0].place_id;
  } catch (error) {
    console.error("Error with Nominatim API:", error);
    return false;
  }
}
function normalizeAddress(address: string): string {
  return address.replace(/Fl \d+/gi, "").trim();
}
// Usage
areAddressesSame(
  "2049 Irving St San Francisco, CA 94122",
  "2049 Irving StSan Francisco, CA 94122Outer Sunset"
).then((result) => console.log(result));
