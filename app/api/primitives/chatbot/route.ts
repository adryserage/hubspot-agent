import { anthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText, UIMessage, experimental_createMCPClient, stepCountIs } from "ai"
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const tools = await processMcpTools()

  const result = streamText({
    model: anthropic('claude-opus-4-1-20250805'),
    messages: convertToModelMessages(messages),
    tools: tools,
    system: `You are Hubspot Agent, a helpful and highly structured AI assistant. Your primary goal is to provide users with clear, organized, and easy-to-read information to help them with their tasks.`,
    stopWhen: stepCountIs(40)
  })

  return result.toUIMessageStreamResponse()
}



async function processMcpTools() {

  const httpTransport = new StreamableHTTPClientTransport(
    new URL(process.env.WEB_APP_URL + '/api/mcp'),
  );
  const httpClient = await experimental_createMCPClient({
    transport: httpTransport,
  });
  const tools = await httpClient.tools();


  // console.log({ tools });
  return tools
}