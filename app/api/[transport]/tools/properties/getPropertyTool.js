import { z } from "zod";
import HubSpotClient from "../../utils/client.js";
import { HUBSPOT_OBJECT_TYPES } from "../../types/objectTypes.js";
const GetPropertySchema = {
  objectType: z
    .string()
    .describe(
      `The type of HubSpot object the property belongs to. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(
        ", "
      )}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`
    ),
  propertyName: z.string().describe("The name of the property to retrieve"),
};
const ToolDefinition = {
  name: "hubspot-get-property",
  description: `
    🎯 Purpose:
      1. This tool retrieves detailed information about a specific property for a HubSpot object type.
      2. You can use this to get all metadata related to a property, including its type, options,
         and other configuration details.
  `,
  inputSchema: GetPropertySchema,
  annotations: {
    title: "Get CRM Property Details",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export const getPropertyTool = {
  name: ToolDefinition.name,
  description: ToolDefinition.description,
  inputSchema: ToolDefinition.inputSchema,
  exec: async (args) => {
    const client = new HubSpotClient();
    try {
      const response = await client.get(
        `/crm/v3/properties/${args.objectType}/${args.propertyName}`
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
            text: `Error retrieving HubSpot property ${args.propertyName} for ${
              args.objectType
            }: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
};
