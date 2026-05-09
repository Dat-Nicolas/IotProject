# Render & Neon Deployment Quick Start

## 1. Generate Secure Secrets

Run these commands to generate secrets for your Render environment:

```bash
# Generate JWT_SECRET (32+ char random string)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

Copy the output to your Render dashboard environment variables.

## 2. Get Neon Connection String

1. Go to https://console.neon.tech
2. Create a new project called "iot-smart-ac"
3. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxxx.region.neon.tech/smart_ac?schema=public&sslmode=require
   ```

## 3. Connect to Render

**Option A: Using render.yaml (Recommended)**
```bash
git add render.yaml
git commit -m "Add Render deployment config"
git push origin main
```

Then on Render dashboard:
1. Click "New +" → "Blueprint"
2. Select your GitHub repo
3. Authorize GitHub
4. Fill in environment variables:
   - `DATABASE_URL`: Your Neon connection string
   - `JWT_SECRET`: Generated secret
   - `SENSOR_DEVICE_KEY`: Your device key
5. Click "Deploy"

**Option B: Manual Setup on Render**
1. Create new "Web Service"
2. Connect GitHub repo
3. Set build command: `npm install && npm run prisma:generate && npm run build`
4. Set start command: `npm run start:prod`
5. Add environment variables
6. Deploy

## 4. Verify Deployment

```bash
# Test the API
curl https://your-service-name.onrender.com/api/health

# Expected response
{
  "status": "ok",
  "service": "smart-ac-backend",
  "timestamp": "2026-05-09T..."
}
```

## 5. Database Migrations

After first deployment, run migrations in Render shell:

```bash
npm run prisma:migrate -- --skip-generate --skip-seed
```

## Files Created/Updated for Render Deployment

- ✅ `render.yaml` - Render blueprint configuration
- ✅ `backend/.env.example` - Development env template
- ✅ `backend/.env.production` - Production env template
- ✅ `DEPLOYMENT.md` - Detailed deployment guide
- ✅ `backend/src/main.ts` - Updated for Render compatibility

## Important Notes

⚠️ **NEVER commit `.env` file to GitHub!**
- Use `.env.example` for template only
- Set secrets in Render dashboard
- Render uses environment variables for sensitive data

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Node version (14+), prisma generate step |
| DB connection error | Verify Neon connection string has `?sslmode=require` |
| Port binding error | Render auto-assigns PORT, check logs |
| CORS errors | CORS is enabled in main.ts |

## Resources

- Render Blueprint Spec: https://render.com/docs/infrastructure-as-code
- Neon Connection: https://neon.tech/docs/connect/connection-pooling
- NestJS Deployment: https://docs.nestjs.com/deployment/deployment
