
import { createMcpHandler, } from "@vercel/mcp-adapter";
import { userCredentialsToolNextjs } from "./tools/oauth/getUserDetailsTool";
import { listAssociationsTool } from "./tools/associations/listAssociationsTool";
import { batchCreateAssociationsTool } from "./tools/associations/batchCreateAssociationsTool";
import { getAssociationDefinitionsTool } from "./tools/associations/getAssociationDefinitionsTool";
import { createEngagementTool } from "./tools/engagements/createEngagementTool";
import { getEngagementTool } from "./tools/engagements/getEngagementTool";
import { updateEngagementTool } from "./tools/engagements/updateEngagementTool";
import { createPropertyTool } from "./tools/properties/createPropertyTool";
import { getPropertyTool } from "./tools/properties/getPropertyTool";
import { listPropertiesTool } from "./tools/properties/listPropertiesTool";
import { updatePropertyTool } from "./tools/properties/updatePropertyTool";
import { batchCreateObjectsTool } from "./tools/objects/batchCreateObjectsTool";
import { batchReadObjectsTool } from "./tools/objects/batchReadObjectsTool";
import { batchUpdateObjectsTool } from "./tools/objects/batchUpdateObjectsTool";
import { getSchemaTool } from "./tools/objects/getSchemaTool";
import { listObjectsTool } from "./tools/objects/listObjectsTool";
import { searchObjectsTool } from "./tools/objects/searchObjectsTool";
import { getWorkflowTool } from "./tools/workflows/getWorkflowTool";
import { listWorkflowsTool } from "./tools/workflows/listWorkflowsTool";



const handler = createMcpHandler(
    (server: any) => {

        server.tool(
            userCredentialsToolNextjs.name,
            userCredentialsToolNextjs.description,
            userCredentialsToolNextjs.inputSchema,
            async (args: any) => {
                return await userCredentialsToolNextjs.exec(args)
            }
        ),
            server.tool(
                listAssociationsTool.name,
                listAssociationsTool.description,
                listAssociationsTool.inputSchema,
                async (args: any) => {
                    return await listAssociationsTool.exec(args)
                }
            ),
            server.tool(
                batchCreateAssociationsTool.name,
                batchCreateAssociationsTool.description,
                batchCreateAssociationsTool.inputSchema,
                async (args: any) => {
                    return await batchCreateAssociationsTool.exec(args)
                }
            ),
            server.tool(
                getAssociationDefinitionsTool.name,
                getAssociationDefinitionsTool.description,
                getAssociationDefinitionsTool.inputSchema,
                async (args: any) => {
                    return await getAssociationDefinitionsTool.exec(args)
                }
            ),
            server.tool(
                createEngagementTool.name,
                createEngagementTool.description,
                createEngagementTool.inputSchema,
                async (args: any) => {
                    return await createEngagementTool.exec(args)
                }
            ),
            server.tool(
                getEngagementTool.name,
                getEngagementTool.description,
                getEngagementTool.inputSchema,
                async (args: any) => {
                    return await getEngagementTool.exec(args)
                }
            ),
            server.tool(
                updateEngagementTool.name,
                updateEngagementTool.description,
                updateEngagementTool.inputSchema,
                async (args: any) => {
                    return await updateEngagementTool.exec(args)
                }
            ),
            server.tool(
                createPropertyTool.name,
                createPropertyTool.description,
                createPropertyTool.inputSchema,
                async (args: any) => {
                    return await createPropertyTool.exec(args)
                }
            ),
            server.tool(
                getPropertyTool.name,
                getPropertyTool.description,
                getPropertyTool.inputSchema,
                async (args: any) => {
                    return await getPropertyTool.exec(args)
                }
            ),
            server.tool(
                listPropertiesTool.name,
                listPropertiesTool.description,
                listPropertiesTool.inputSchema,
                async (args: any) => {
                    return await listPropertiesTool.exec(args)
                }
            ),
            server.tool(
                updatePropertyTool.name,
                updatePropertyTool.description,
                updatePropertyTool.inputSchema,
                async (args: any) => {
                    return await updatePropertyTool.exec(args)
                }
            )

            ,
            server.tool(
                batchCreateObjectsTool.name,
                batchCreateObjectsTool.description,
                batchCreateObjectsTool.inputSchema,
                async (args: any) => {
                    return await batchCreateObjectsTool.exec(args)
                }
            ),
            server.tool(
                batchReadObjectsTool.name,
                batchReadObjectsTool.description,
                batchReadObjectsTool.inputSchema,
                async (args: any) => {
                    return await batchReadObjectsTool.exec(args)
                }
            ),
            server.tool(
                batchUpdateObjectsTool.name,
                batchUpdateObjectsTool.description,
                batchUpdateObjectsTool.inputSchema,
                async (args: any) => {
                    return await batchUpdateObjectsTool.exec(args)
                }
            ),
            server.tool(
                getSchemaTool.name,
                getSchemaTool.description,
                getSchemaTool.inputSchema,
                async (args: any) => {
                    return await getSchemaTool.exec(args)
                }
            ),
            server.tool(
                listObjectsTool.name,
                listObjectsTool.description,
                listObjectsTool.inputSchema,
                async (args: any) => {
                    return await listObjectsTool.exec(args)
                }
            ),
            server.tool(
                searchObjectsTool.name,
                searchObjectsTool.description,
                searchObjectsTool.inputSchema,
                async (args: any) => {
                    return await searchObjectsTool.exec(args)
                }
            )
            ,
            server.tool(
                getWorkflowTool.name,
                getWorkflowTool.description,
                getWorkflowTool.inputSchema,
                async (args: any) => {
                    console.log(getWorkflowTool.inputSchema)
                    return await getWorkflowTool.exec(args)
                }
            ),
            server.tool(
                listWorkflowsTool.name,
                listWorkflowsTool.description,
                listWorkflowsTool.inputSchema,
                async (args: any) => {
                    return await listWorkflowsTool.exec(args)
                }
            )
    },
    {
        // Optional server options
    },
    {
        // Optional redis config
        // redisUrl: process.env.REDIS_URL,
        basePath: "/api", // this needs to match where the [transport] is located.
        maxDuration: 6000000,
        verboseLogs: true,
    }
);
export { handler as GET, handler as POST, handler as DELETE };
