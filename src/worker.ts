import { createMcpHandler } from 'agents/mcp'

import { lightningChartSkillMarkdown } from './skill.generated.js'
import { createLightningChartMcpServer, normalizeSkillBody } from './server.js'

const MCP_PATH = '/mcp'
const PRODUCTION_MCP_PATH = '/js-charts/trader/mcp'
const MAX_BODY_BYTES = 64 * 1024
const lightningChartSkillBody = normalizeSkillBody(lightningChartSkillMarkdown)

function withSecurityHeaders(response: Response): Response {
    const headers = new Headers(response.headers)
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Cache-Control', 'no-store')
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    })
}

function textResponse(body: string, status = 200): Response {
    return withSecurityHeaders(
        new Response(body, {
            status,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        }),
    )
}

function jsonResponse(body: unknown, status: number): Response {
    return withSecurityHeaders(
        Response.json(body, {
            status,
        }),
    )
}

function isBodyTooLarge(request: Request): boolean {
    const contentLength = request.headers.get('content-length')
    if (contentLength === null) return false

    const bytes = Number(contentLength)
    return Number.isFinite(bytes) && bytes > MAX_BODY_BYTES
}

function createHandler(route: string) {
    return createMcpHandler(
        createLightningChartMcpServer({
            getSkillBody: () => lightningChartSkillBody,
        }),
        {
            route,
        },
    )
}

export default {
    async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url)

        try {
            if (url.pathname === '/healthz') {
                return textResponse('ok')
            }

            if (url.pathname === '/readyz') {
                return textResponse('ready')
            }

            if (url.pathname === MCP_PATH || url.pathname === PRODUCTION_MCP_PATH) {
                if (isBodyTooLarge(request)) {
                    return jsonResponse({ error: 'Request body too large' }, 413)
                }

                return withSecurityHeaders(await createHandler(url.pathname)(request, env, ctx))
            }

            return jsonResponse({ error: 'Not found' }, 404)
        } catch (error) {
            console.error('Unhandled Worker error', error)
            return jsonResponse({ error: 'Internal server error' }, 500)
        }
    },
}
