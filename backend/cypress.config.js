import { defineConfig } from 'cypress'

const PORT = process.env.PORT || 3000;

const baseUrl = `http://localhost:${PORT}`;

export default defineConfig({
    e2e: {
        baseUrl: baseUrl,
    },
})