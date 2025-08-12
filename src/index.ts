import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from 'zod';
// import { ErrorCode } from '@modelcontextprotocol/sdk/types';

function Server():McpServer {
    // Create an MCP server with a simple echo tool
    const server = new McpServer({ name: 'Demo', version: '1.0.0' });

    server.registerTool(
        "add",
        {
            title: "Addition Tool",
            description: "Add two numbers",
            inputSchema: { a: z.number(), b: z.number() }
        },
        async ({ a, b }) => ({
            content: [
                { type: "text", text: String(a + b) }
            ]
        })
    );

    return server

}


const app = express();
app.use(express.json());

// Set up the Streamable HTTP transport at /mcp
app.all('/mcp', async (req, res) => {

    try {
        const server = Server()

        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        
        res.on("close", () => {
            console.log("request closed")
            transport.close()
            server.close()
        })

        await server.connect(transport);

        await transport.handleRequest(req, res, req.body)
    } catch (error: unknown) {
        console.error("Error handling MCP request", error)
        if (!res.headersSent) {
            res.status(500).json({
                jsonrps: '2.0',
                error: {
                    code:-32603, message: "internal server error"
                }, id: null
            })
        }
    }
});

app.listen(3000, () => {
    console.log('MCP Streamable HTTP server running at http://localhost:3000');
});