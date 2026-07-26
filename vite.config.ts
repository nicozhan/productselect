import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    // Serve under /test2 so v1 (root) stays online while v2 is tested
    base: '/test2/',
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
  };
})
