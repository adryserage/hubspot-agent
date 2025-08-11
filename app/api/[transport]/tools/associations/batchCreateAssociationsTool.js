import { z } from "zod";
import HubSpotClient from "../../utils/client.js";
import { HUBSPOT_OBJECT_TYPES } from "../../types/objectTypes.js";
const AssociationTypeSchema = z.object({
  associationCategory: z.enum([
    "HUBSPOT_DEFINED",
    "USER_DEFINED",
    "INTEGRATOR_DEFINED",
  ]),
  associationTypeId: z.number().int().positive(),
});
const AssociationInputSchema = z.object({
  from: z.object({
    id: z.string().describe("The ID of the object to create association from"),
  }),
  to: z.object({
    id: z.string().describe("The ID of the object to create association to"),
  }),
});
const ObjectAssociationSchema = {
  fromObjectType: z
    .string()
    .describe(
      `The type of HubSpot object to create association from. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(
        ", "
      )}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`
    ),
  toObjectType: z
    .string()
    .describe(
      `The type of HubSpot object to create association to. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(
        ", "
      )}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`
    ),
  types: z
    .array(AssociationTypeSchema)
    .min(1)
    .describe("The types of associations to create"),
  inputs: z
    .array(AssociationInputSchema)
    .min(1)
    .describe(
      "List of association inputs defining the relationships to create. (max 100 associations per batch)"
    ),
};
const ToolDefinition = {
  name: "hubspot-batch-create-associations",
  description: `
    🛡️ Guardrails:
      1.  Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

    🎯 Purpose:
      1. Establishes relationships between HubSpot objects, linking records across different object types, by creating associations between objects in batch.
      2. Uses a single set of association types for all associations in the batch.

    📋 Prerequisites:
      1. Use the hubspot-get-user-details tool to get the OwnerId and UserId if you don't have that already.
      2. Use the hubspot-get-association-definitions tool to identify valid association types before creating associations.
  `,
  inputSchema: ObjectAssociationSchema,
  annotations: {
    title: "Create CRM Object Associations in Batch",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export const batchCreateAssociationsTool = {
  name: ToolDefinition.name,
  description: ToolDefinition.description,
  inputSchema: ToolDefinition.inputSchema,
  exec: async (args) => {
    try {
      const client = new HubSpotClient();
      // Add types to each input
      const inputs = args.inputs.map((input) => ({
        ...input,
        types: args.types,
      }));
      const response = await client.post(
        `/crm/v4/associations/${args.fromObjectType}/${args.toObjectType}/batch/create`,
        {
          body: { inputs },
        }
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
            text: `Error creating HubSpot associations: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  },
};
