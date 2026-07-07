# Portfolio AI Gateway

This directory contains the Cloudflare Worker that acts as a secure Backend Proxy/AI Gateway for the portfolio ChatBot.

It protects the OpenRouter API Key from being exposed in the frontend and enforces strict CORS policies.

## Setup & Deployment

1. **Install Dependencies:**
   Make sure you are in the `proxy/` directory and run:
   ```bash
   npm install
   ```

2. **Authenticate with Cloudflare:**
   Log in to your Cloudflare account via Wrangler:
   ```bash
   npx wrangler login
   ```

3. **Configure the Allowed Origin:**
   Open `proxy/wrangler.toml` and update the `ALLOWED_ORIGIN` variable to match your GitHub Pages domain (e.g., `https://your-github-username.github.io`).

4. **Add your OpenRouter API Key securely:**
   Upload your OpenRouter API Key as a Cloudflare Worker Secret. This keeps it out of the source code.
   ```bash
   npx wrangler secret put OPENROUTER_API_KEY
   ```
   (Wrangler will prompt you to paste the key).

5. **Deploy the Worker:**
   Deploy the code to Cloudflare's edge network:
   ```bash
   npx wrangler deploy
   ```

## Local Development

To run the worker locally for testing with your frontend:

```bash
npx wrangler dev
```

By default, the worker will run on `http://localhost:8787`. The CORS configuration automatically permits requests originating from `localhost` or `127.0.0.1`.

**Note:** You may need to create a local `.dev.vars` file in the `proxy/` directory for local testing to supply the API key:
```env
OPENROUTER_API_KEY=your_actual_key_here
```
*(Do not commit `.dev.vars` to version control!)*