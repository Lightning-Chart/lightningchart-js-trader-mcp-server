import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const stateRoot = path.join(root, '.wrangler-local')
const configHome = path.join(stateRoot, 'config')
const logPath = path.join(stateRoot, 'logs')
const wranglerBin = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js')

await mkdir(configHome, { recursive: true })
await mkdir(logPath, { recursive: true })

async function readDotEnv(filePath) {
    try {
        const body = await readFile(filePath, 'utf8')
        return Object.fromEntries(
            body
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter((line) => line !== '' && !line.startsWith('#'))
                .map((line) => {
                    const separator = line.indexOf('=')
                    if (separator === -1) return undefined

                    const key = line.slice(0, separator).trim()
                    let value = line.slice(separator + 1).trim()
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1)
                    }

                    return key ? [key, value] : undefined
                })
                .filter(Boolean),
        )
    } catch (error) {
        if (error && error.code === 'ENOENT') return {}
        throw error
    }
}

const env = {
    ...Object.fromEntries(Object.entries(process.env).filter(([key, value]) => key !== '' && !key.includes('=') && value !== undefined)),
    ...(await readDotEnv(path.join(root, '.env'))),
}

const child = spawn(process.execPath, [wranglerBin, ...process.argv.slice(2)], {
    cwd: root,
    env: {
        ...env,
        XDG_CONFIG_HOME: configHome,
        WRANGLER_LOG_PATH: logPath,
    },
    stdio: 'inherit',
})

child.on('exit', (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal)
        return
    }

    process.exit(code ?? 1)
})
