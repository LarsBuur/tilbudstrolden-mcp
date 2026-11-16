#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./create-server.js";
import { SERVER_VERSION } from "./version.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`TilbudsTrolden MCP server v${SERVER_VERSION} running on stdio`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
