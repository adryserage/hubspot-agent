import { z } from "zod";
import HubSpotClient from "../../utils/client.js";
import { HUBSPOT_OBJECT_TYPES } from "../../types/objectTypes.js";
const PropertiesListSchema = {
  objectType: z
    .string()
    .describe(
      `The type of HubSpot object to get properties for. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(
        ", "
      )}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`
    ),
  archived: z
    .boolean()
    .default(false)
    .describe("Whether to return only properties that have been archived."),
  includeHidden: z
    .boolean()
    .default(false)
    .describe("Whether to include hidden properties in the response."),
};
const ToolDefinition = {
  name: "hubspot-list-properties",
  description: `
    🎯 Purpose:
      1. This tool retrieves a complete catalog of properties for any HubSpot object type.

    🧭 Usage Guidance:
      1. This API has a large response that can consume a lot of tokens. Use the hubspot-list-objects tool to sample existing objects for the object type first.
      2. Try to use the hubspot-get-property tool to get a specific property.
      3. Use at the beginning of workflows to understand available data structures.
  `,
  inputSchema: PropertiesListSchema,
  annotations: {
    title: "List CRM Properties",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export const listPropertiesTool = {
  name: ToolDefinition.name,
  description: ToolDefinition.description,
  inputSchema: ToolDefinition.inputSchema,
  exec: async (args) => {
    const client = new HubSpotClient();

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("archived", args.archived?.toString() || "false");
      queryParams.append(
        "includeHidden",
        args.includeHidden?.toString() || "false"
      );
      const response = await client.get(
        `/crm/v3/properties/${args.objectType}?${queryParams.toString()}`
      );
      // Filter each result to only include the specified fields
      const filteredResults = response.results.map((property) => ({
        name: property.name,
        label: property.label,
        type: property.type,
        description: property.description,
        groupName: property.groupName,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                results: filteredResults,
                paging: response.paging,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing HubSpot properties for ${args.objectType}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  },
};
