#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { getLightningChartSkillBody } from './node-context.js'
import { createLightningChartMcpServer } from './server.js'

async function main(): Promise<void> {
    const server = createLightningChartMcpServer({
        getSkillBody: getLightningChartSkillBody,
    })
    const transport = new StdioServerTransport()
    await server.connect(transport)
}

main().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
})
