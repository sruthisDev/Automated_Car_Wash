## By Sruthi Satyavarapu

## LuxeWash - Setup

This guide gives info on how to deploy this website


## Prereqs

- Python 3.11+
- Node.js 18+
- Git
- Stripe Account for payment keys
- Gmail for smtp


## 1. Backend setup


Install dependencies:

pip install -r requirements.txt

Create a `.env` file inside the `backend/` folder with the following keys

```env
SECRET_KEY=pick-any-long-random-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=LuxeWash <your_gmail@gmail.com>

DATABASE_URL=sqlite:///./luxewash.db

APP_BASE_URL=http://localhost
```

> **Note on Gmail:** You need to generate an App Password, not your regular Gmail password.
> Go to your Google account → Security → 2-Step Verification → App Passwords. Generate one for "Mail".

> **Note on Stripe:** Get your keys from the Stripe dashboard under Developers → API Keys. Use the test keys (they start with `sk_test_` and `pk_test_`).

Start the backend:

uvicorn main:app --reload --port 8000

The database file (`luxewash.db`) and seed data are created automatically on first run.


## 2. Frontend setup

Open a new terminal, go into the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
```

This should be the same publishable key you put in the backend `.env`.

Start the frontend:

npm run dev

## 3. Test credentials (seed data)

The app seeds two accounts on first startup:

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@luxewash.com     | Admin@1234  |
| User  | sarah@example.com      | Sarah@1234  |

Sarah's account comes with a Premium membership and a few sample bookings so you can test the dashboard right away.

---

## 5. Production deployment (Windows + IIS)

If you're deploying on a Windows server with IIS, there are a few extra steps.

**Register the backend as a Windows service using NSSM:**

```bash
nssm install LuxewashBackend
```

Set the path to `uvicorn.exe` inside the venv and the arguments to `main:app --port 8000`. This makes the backend start automatically on boot.

**Frontend — build for production:**

```bash
cd frontend
npm run build
```

This creates a `dist/` folder. Point your IIS site to serve from that folder.

**IIS reverse proxy:**

Install the URL Rewrite and Application Request Routing (ARR) modules for IIS.
Add a `web.config` to the site root to proxy `/api/*` requests to `http://localhost:8000` and fall back all other routes to `index.html` for the React SPA.