import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
let client: Client | undefined = undefined
const baseUrl = new URL('http://localhost:3000/mcp');

client = new Client({
    name: 'Demo',
    version: '1.0.0'
});
const transport = new StreamableHTTPClientTransport(
    new URL(baseUrl)
);
client.connect(transport);
const tools= client.listTools()
console.log(tools)
console.log("Connected using Streamable HTTP transport");