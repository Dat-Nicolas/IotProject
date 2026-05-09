# Deployment Guide - IoT Smart AC Backend to Render with Neon

## Prerequisites
- GitHub account with the IoT project repository
- Render account (https://render.com)
- Neon account (https://console.neon.tech)

## Step 1: Setup Neon Database

1. Go to https://console.neon.tech and sign in
2. Create a new project (or use existing)
3. Create a database named `smart_ac`
4. Copy the connection string from the dashboard
   - Format: `postgresql://username:password@host.neon.tech/smart_ac?schema=public&sslmode=require`

## Step 2: Prepare Your Repository

1. Commit and push the `render.yaml` file to your GitHub repository
2. Make sure your `.env.example` is committed (but NOT `.env` with secrets)
3. Ensure `package.json` has these scripts:
   ```json
   "build": "nest build",
   "start": "nest start",
   "start:prod": "node dist/main",
   "prisma:generate": "prisma generate",
   "prisma:migrate": "prisma migrate dev"
   ```

## Step 3: Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Select your GitHub repository containing the IoT project
4. Authorize GitHub access if prompted
5. Fill in the required environment variables:
   - **DATABASE_URL**: Paste your Neon connection string
   - **JWT_SECRET**: Generate a secure random string (e.g., `openssl rand -base64 32`)
   - **SENSOR_DEVICE_KEY**: Your ESP32 device key
   - **NODE_ENV**: `production`

6. Review the blueprint configuration from `render.yaml`
7. Click "Deploy"

## Step 4: Run Database Migrations

After deployment:

1. Go to your Render service dashboard
2. Open "Shell" tab
3. Run migration to create database schema:
   ```bash
   npm run prisma:migrate -- --skip-generate --skip-seed
   ```
4. Or seed if you have initial data:
   ```bash
   npm run prisma:seed
   ```

## Step 5: Verify Deployment

- Check your API at: `https://your-service-name.onrender.com/api/health`
- Should return: `{"status":"ok","service":"smart-ac-backend","timestamp":"..."}`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `3000` |
| `API_PREFIX` | API base path | `api` |
| `DATABASE_URL` | Neon database URL | `postgresql://...` |
| `JWT_SECRET` | JWT signing secret (CHANGE THIS!) | `your-secure-random-string` |
| `JWT_EXPIRES_IN` | Token expiry in seconds | `86400` |
| `SENSOR_DEVICE_KEY` | ESP32 device authentication key | `your-device-key` |

## Troubleshooting

### Build fails with Prisma error
```bash
# Add --skip-generate flag if needed
npm run build -- --skip-generate
```

### Database connection fails
- Verify Neon connection string includes `?sslmode=require`
- Check that Neon IP whitelist allows Render's IP range
- In Neon console, allow all IPs (0.0.0.0/0) for development

### Port binding issues
Render automatically assigns PORT via environment variable. No need to hardcode.

## Auto-Deploy Configuration

Edit `render.yaml` to auto-deploy on git push:
- Render watches your repository by default
- Any push to main branch triggers new deployment
- Rollback available in Render dashboard if needed

## Resources
- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- NestJS Build: https://docs.nestjs.com/deployment/deployment
