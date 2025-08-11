import { z } from "zod";
import HubSpotClient from "../../utils/client.js";
const GetEngagementSchema = {
  engagementId: z
    .number()
    .int()
    .positive()
    .describe("The ID of the engagement to retrieve"),
};
const ToolDefinition = {
  name: "hubspot-get-engagement",
  description: `
    🎯 Purpose:
      1. Retrieves a HubSpot engagement by ID.
  `,
  inputSchema: GetEngagementSchema,
  annotations: {
    title: "Get Engagement",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export const getEngagementTool = {
  name: ToolDefinition.name,
  description: ToolDefinition.description,
  inputSchema: ToolDefinition.inputSchema,
  exec: async (args) => {
    const client = new HubSpotClient();
    try {
      const { engagementId } = args;
      const response = await client.get(
        `/engagements/v1/engagements/${engagementId}`
      );
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
            text: `Error retrieving HubSpot engagement: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  },
};
