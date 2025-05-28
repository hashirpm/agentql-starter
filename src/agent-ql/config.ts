export const NEXT_PAGE_PROMPT =
  "Button to navigate to the next page of results";
export const BROWSER_IGNORED_ARGS = [
  "--enable-automation",
  "--disable-extensions",
];
export const BROWSER_ARGS = [
  "--disable-xss-auditor",
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-blink-features=AutomationControlled",
  "--disable-features=IsolateOrigins,site-per-process",
  "--disable-infobars",
];

export const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0",
];

export const LOCATIONS = [
  ["America/New_York", { longitude: -74.006, latitude: 40.7128 }], // New York, NY
  ["America/Chicago", { longitude: -87.6298, latitude: 41.8781 }], // Chicago, IL
  ["America/Los_Angeles", { longitude: -118.2437, latitude: 34.0522 }], // Los Angeles, CA
  ["America/Denver", { longitude: -104.9903, latitude: 39.7392 }], // Denver, CO
  ["America/Phoenix", { longitude: -112.074, latitude: 33.4484 }], // Phoenix, AZ
  ["America/Anchorage", { longitude: -149.9003, latitude: 61.2181 }], // Anchorage, AK
  ["America/Detroit", { longitude: -83.0458, latitude: 42.3314 }], // Detroit, MI
  ["America/Indianapolis", { longitude: -86.1581, latitude: 39.7684 }], // Indianapolis, IN
  ["America/Boise", { longitude: -116.2023, latitude: 43.615 }], // Boise, ID
  ["America/Juneau", { longitude: -134.4197, latitude: 58.3019 }], // Juneau, AK
];

export const REFERERS = [
  "https://www.google.com",
  "https://www.bing.com",
  "https://duckduckgo.com",
];

export const ACCEPT_LANGUAGES = [
  "en-US,en;q=0.9",
  "en-GB,en;q=0.9",
  "fr-FR,fr;q=0.9",
];

export const PROXIES = [
  // TODO: replace with your own proxies
  // {
  //     server: 'http://ip_server:port',
  //     username: 'proxy_username',
  //     password: 'proxy_password',
  // },
];
