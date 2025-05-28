# Agent QL Scraper (TypeScript Node.js Starter)

This is a starter kit for building web scrapers using Node.js and TypeScript, powered by AgentQL.

**Note:** To overcome request limits on the AgentQL free plan, this project supports using multiple API keys. Make sure to create different API keys using separate email addresses and list them (comma-separated) in your `.env` file.

## Project Structure

```
src/
  index.ts             # Main entry point for scraping workflows
  agent-ql/            # AgentQL-based scraping logic and websocket integration
  lib/                 # Query definitions, constants, and core helpers
```

### WebSocket Scraping Setup

To scrape dynamic sites or use advanced scraping techniques, you can connect to a browser WebSocket using Chrome’s DevTools Protocol.

#### How to start Chrome with remote debugging:

##### macOS

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  --no-first-run \
  --no-default-browser-check
```

##### Linux

```bash
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  --no-first-run \
  --no-default-browser-check
```

##### Windows (PowerShell)

```powershell
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir=C:\chrome-debug `
  --no-first-run `
  --no-default-browser-check
```

#### Getting the WebSocket URL
1. After launching Chrome with the above commands, navigate to: `http://localhost:9222/json/version`
2. Copy the WebSocket URL from the response
3. Set it as `WEBSOCKET_URL` in your `.env` file

### Environment Setup
1. Copy the example environment file to create your own `.env` file in the project root:
   ```sh
   cp .env.example .env
   ```
2. Edit the `.env` file and set your AgentQL API keys and Websocket URL obtained above:
   ```env
   AGENTQL_API_KEYS=your_key1,your_key2,...
   WEBSOCKET_URL=your_websocket_url
   ```
   
### Installation

```sh
pnpm install
# or
npm install
```

### Running the Scraper

```sh
pnpm dev
# or
npm run dev
```

The main workflow is defined in `src/index.ts`. It will:

- Scrape list pages (e.g., TripAdvisor cafes)
- Extract and save detailed links
- Scrape detailed data for each link
- Save all results to a JSON file

### Customizing Scraping Logic

- Add scraping website URL in `src/lib/const.ts`
- Edit queries in `src/lib/query.ts`
- Add new data sources or modify existing ones in `src/index.ts`

## Key Scripts & Helpers

- `extractLinks.ts`: Extracts attribute values (e.g., tripadvisor_detailed_link) from data arrays
- `fileHandler.ts`: Load, save, and combine JSON files
- `scrapeHelper.ts`: Runs and manages the scraping process
- `websocket.ts`: Handles scraping via AgentQL and Playwright with pagination and retries
