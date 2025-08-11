import { z } from "zod";
import HubSpotClient from "../../utils/client.js";
const GetWorkflowSchema = {
  flowId: z.string().describe("The ID of the workflow to retrieve"),
};
const ToolDefinition = {
  name: "hubspot-get-workflow",
  description: `
    🎯 Purpose:
      1. This tool retrieves detailed information about a specific workflow from the HubSpot account.

    🧭 Usage Guidance:
      1. Use the "flowId" parameter to specify which workflow to retrieve.
      2. This endpoint returns complete workflow information including actions, enrollment criteria, and scheduling.
      3. Use the hubspot-list-workflows tool first to identify the workflow ID you need.
  `,
  inputSchema: GetWorkflowSchema,
  annotations: {
    title: "Get HubSpot Workflow Details",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export const getWorkflowTool = {
  name: ToolDefinition.name,
  description: ToolDefinition.description,
  inputSchema: ToolDefinition.inputSchema,
  exec: async (args) => {
    const client = new HubSpotClient();

    try {
      const response = await client.get(`/automation/v4/flows/${args.flowId}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving HubSpot workflow (ID: ${args.flowId}): ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  },
};
