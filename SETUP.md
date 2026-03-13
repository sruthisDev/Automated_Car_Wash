# LuxeWash — Setup & Hosting Guide

## 1. First-Time Setup

### Backend
```bash
cd backend
python -m venv venv
./venv/Scripts/pip install -r requirements.txt
```

Edit `backend/.env` and fill in:
- `STRIPE_SECRET_KEY` — from Stripe Dashboard → Developers → API Keys (use test key)
- `STRIPE_WEBHOOK_SECRET` — from Stripe Dashboard → Webhooks
- `SMTP_USER` — your Gmail address
- `SMTP_PASSWORD` — Gmail App Password (not your regular password)
  → Google Account → Security → 2-Step Verification → App passwords

### Frontend
```bash
cd frontend
npm install
```

Edit `frontend/.env`:
- `VITE_STRIPE_PUBLIC_KEY` — from Stripe Dashboard (publishable key, starts with pk_test_)

Build for production:
```bash
cd frontend
npm run build
```

---

## 2. Run Locally (Dev)

**Terminal 1 — Backend:**
```bash
cd backend
./venv/Scripts/uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## 3. PM2 Auto-Start Setup (Windows — Resiliency)

### Install PM2
```bash
npm install -g pm2
npm install -g pm2-windows-service
```

### Build frontend first
```bash
cd frontend
npm run build
```

### Start with PM2
```bash
cd C:/Masters/repo/Automated_Car_Wash
pm2 start ecosystem.config.js
pm2 save
```

### Install as Windows Service (auto-starts on reboot)
```bash
pm2-service-install -n LuxeWash
```

When prompted, set the PM2_HOME path and confirm.

### Verify running
```bash
pm2 status
pm2 logs
```

---

## 4. IIS Setup (Reverse Proxy)

### Prerequisites
- IIS installed (Windows Features → Internet Information Services)
- URL Rewrite module: https://www.iis.net/downloads/microsoft/url-rewrite
- ARR (Application Request Routing): https://www.iis.net/downloads/microsoft/application-request-routing

### Steps

1. Open IIS Manager
2. Click the server node → Application Request Routing Cache → Server Proxy Settings → Enable proxy ✅
3. Create a new website:
   - Site name: LuxeWash
   - Physical path: C:\Masters\repo\Automated_Car_Wash\frontend\dist
   - Port: 80

4. Add a `web.config` to `frontend/dist/`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- API → FastAPI backend -->
        <rule name="API Proxy" stopProcessing="true">
          <match url="^api/(.*)" />
          <action type="Rewrite" url="http://localhost:8000/api/{R:1}" />
        </rule>
        <!-- SPA fallback for React Router -->
        <rule name="SPA Fallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

5. Restart IIS: `iisreset`

---

## 5. Gmail App Password Setup

1. Go to myaccount.google.com
2. Security → 2-Step Verification (must be enabled)
3. Search "App passwords"
4. Create new → name it "LuxeWash"
5. Copy the 16-character password
6. Paste into `backend/.env` as `SMTP_PASSWORD`

---

## 6. Stripe Test Cards

Use these card numbers for testing:

| Card | Number |
|------|--------|
| Visa (success) | 4242 4242 4242 4242 |
| Declined | 4000 0000 0000 0002 |
| Insufficient funds | 4000 0000 0000 9995 |

Expiry: any future date | CVV: any 3 digits | ZIP: any 5 digits

---

## 7. File Structure

```
Automated_Car_Wash/
├── frontend/          React + Vite
│   ├── src/
│   │   ├── pages/     All page components
│   │   ├── components/ Navbar, Footer
│   ├── dist/          Production build (after npm run build)
│   └── .env           Stripe public key
├── backend/           FastAPI + Python
│   ├── routes/        auth, contact, dashboard, payments, email
│   ├── models/        SQLAlchemy models
│   ├── main.py        FastAPI entry point
│   ├── database.py    SQLite connection
│   ├── luxewash.db    SQLite database file
│   └── .env           Secrets (Stripe, Gmail, JWT)
└── ecosystem.config.js  PM2 process config
```
