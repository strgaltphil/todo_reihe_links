import { defineConfig } from 'cypress'

const PORT = process.env.PORT || 3000;

const baseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev`
  : `http://localhost:${PORT}`;

export default defineConfig({
    e2e: {
        baseUrl: baseUrl,
    },
})