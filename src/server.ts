import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const SERVER_NAME = 'lightningchart-js-trader'
const SERVER_VERSION = '1.0.5'

export type LightningChartContextProvider = () => string | Promise<string>

export function normalizeSkillBody(skill: string): string {
    return skill.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim()
}

export interface LightningChartMcpServerOptions {
    getSkillBody: LightningChartContextProvider
}

export function createLightningChartMcpServer(options: LightningChartMcpServerOptions): McpServer {
    const server = new McpServer({
        name: SERVER_NAME,
        version: SERVER_VERSION,
    })

    server.registerTool(
        'get_lightningchart_context',
        {
            description:
                'Get essential context for working with LightningChart JS Trader before writing chart or data visualization code. Call this at the start of any task involving LightningChart JS Trader, LCJS Trader, trading charts, dashboards, real-time data, large datasets, or financial charts.',
            inputSchema: {},
            annotations: {
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async () => {
            const context = await options.getSkillBody()

            return {
                content: [
                    {
                        type: 'text',
                        text: `# LightningChart JS Trader Agent Context\n\n${context}`,
                    },
                ],
            }
        },
    )

    return server
}
