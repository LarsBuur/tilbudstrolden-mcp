/**
 * Tests for createServer: the factory builds a complete server without starting
 * a transport, and a caller-supplied storage backend is what the tools use.
 * Talks to the server through a real MCP client over InMemoryTransport.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, describe, expect, it } from "vitest";
import { createServer, SERVER_INSTRUCTIONS } from "./create-server.js";
import { type DataStore, setStorageBackend } from "./store.js";

async function connect(server: ReturnType<typeof createServer>) {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

afterEach(() => {
  setStorageBackend(null);
});

describe("createServer", () => {
  it("registers all 18 tools and 3 prompts", async () => {
    const client = await connect(createServer({ storage: memory() }));
    const { tools } = await client.listTools();
    const { prompts } = await client.listPrompts();
    expect(tools).toHaveLength(18);
    expect(prompts).toHaveLength(3);
    await client.close();
  });

  it("hands the instructions to connecting clients", async () => {
    const client = await connect(createServer({ storage: memory() }));
    expect(client.getInstructions()).toBe(SERVER_INSTRUCTIONS);
    await client.close();
  });

  it("routes tool calls through the supplied storage backend", async () => {
    const mem = memory();
    const client = await connect(createServer({ storage: mem }));
    await client.callTool({ name: "update_pantry", arguments: { add: ["salt"] } });
    expect(mem.value?.pantry).toEqual(["salt"]);
    await client.close();
  });
});

function memory() {
  const backend = {
    value: null as DataStore | null,
    async read() {
      return backend.value;
    },
    async write(data: DataStore) {
      backend.value = structuredClone(data);
    },
  };
  return backend;
}
