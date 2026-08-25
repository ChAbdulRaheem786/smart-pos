# Smart Store — MERN Point of Sale

A two-panel point-of-sale system:

- **User panel** (`/`) — public, no login. Browse categories and products, add to cart,
  and check out by filling in delivery details and uploading a payment proof screenshot.
- **Admin panel** (`/admin`) — password protected (password lives in the backend `.env`,
  never in the frontend). Manage categories, products (photos, colors, sizes, price,
  stock, featured flag), homepage header banners, and incoming orders (view payment
  proof, update status, delete).

## Stack

- **Backend**: Express.js + MongoDB (Mongoose), deployed as a Vercel serverless function
- **Frontend**: React (Vite) + Tailwind CSS + React Router, deployed as its own Vercel project
- **Database**: MongoDB Atlas (free tier is enough to start)
- **Image storage**: Cloudinary (product photos, category images, banners, and payment
  proof uploads all go here — Vercel functions have no persistent disk)
- **Admin auth**: a single shared password from `.env`, exchanged for a short-lived JWT
  stored in the browser's `localStorage`. There's no per-user admin accounts — this
  matches "one shop, one admin" businesses. If you need multiple admin logins later,
  swap `ADMIN_PASSWORD` comparison in `server/src/routes/adminAuthRoutes.js` for a
  users collection with bcrypt-hashed passwords.

## Project layout

```
pos-system/
  server/     Express API — deploy as Vercel Project #1
  client/     React storefront + admin UI — deploy as Vercel Project #2
```

They deploy as **two separate Vercel projects** and talk to each other over HTTPS
(the frontend calls the backend's public URL, configured via an env var).

---

## 1. Set up MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user (username + password).
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) — Vercel's
   serverless functions don't have static IPs.
4. Copy the connection string (looks like
   `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/pos-system?retryWrites=true&w=majority`).
   You'll use this as `MONGO_URI`.

## 2. Set up Cloudinary

1. Create a free account at https://cloudinary.com.
2. On your Dashboard, copy **Cloud name**, **API Key**, and **API Secret**.

## 3. Run the backend locally (optional but recommended first)

```bash
cd server
cp .env.example .env
# fill in MONGO_URI, ADMIN_PASSWORD, ADMIN_JWT_SECRET, Cloudinary keys, CLIENT_ORIGIN
npm install
npm run dev
```

The API will run at `http://localhost:5000`. Hit `http://localhost:5000/api/health`
to confirm it's up.

## 4. Run the frontend locally

```bash
cd client
cp .env.example .env
# set VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

Visit `http://localhost:5173` for the store, and `http://localhost:5173/admin` for
the admin login (password = whatever you set as `ADMIN_PASSWORD`).

---

## 5. Deploy the backend to Vercel

From the `server/` folder:

```bash
cd server
npx vercel
```

Follow the prompts (link or create a new project). Then set environment variables —
either via `npx vercel env add <NAME>` for each one, or in the Vercel dashboard under
**Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `ADMIN_PASSWORD` | the password you'll type into `/admin` |
| `ADMIN_JWT_SECRET` | a long random string (e.g. `openssl rand -hex 32`) |
| `ADMIN_JWT_EXPIRES_IN` | `7d` (optional, defaults to 7 days) |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `CLIENT_ORIGIN` | your frontend's deployed URL, e.g. `https://your-store.vercel.app` (comma-separate multiple origins if needed) |

Redeploy after adding env vars: `npx vercel --prod`.

Note the deployed URL, e.g. `https://pos-server-xyz.vercel.app` — you'll need it next.

## 6. Deploy the frontend to Vercel

From the `client/` folder:

```bash
cd client
npx vercel
```

Set environment variables in the Vercel dashboard for this project:

| Variable | Value |
|---|---|
| `VITE_API_URL` | your backend's deployed URL from step 5, **no trailing slash** |
| `VITE_CURRENCY` | e.g. `PKR`, `USD`, `AED` (optional, defaults to `PKR`) |

Redeploy: `npx vercel --prod`.

Then go back to the **backend** project's `CLIENT_ORIGIN` env var and make sure it
matches this frontend URL exactly (Vercel gives you a stable production domain even
if preview URLs change), then redeploy the backend once more so CORS allows it.

---

## Using the admin panel

1. Go to `https://your-frontend.vercel.app/admin`.
2. Enter the `ADMIN_PASSWORD` you set on the backend.
3. From there you can:
   - **Categories** — create/edit/delete categories with a cover image.
   - **Products** — add products with multiple photos, price, optional discount
     price, stock, colors, sizes, and a "featured" toggle (controls the homepage
     featured swiper).
   - **Orders** — see every order placed by customers, view their uploaded payment
     proof, and move status through pending → confirmed → shipped → completed (or
     cancelled).
   - **Banners & settings** — upload/remove homepage header banner images and set
     the store name shown in the navbar.

## Customer flow (no login needed)

1. Browse categories or scroll the homepage.
2. Click a product → pick color/size if applicable → **Add to cart** or **Order now**.
3. At checkout, fill in name, phone, address, city, and upload a screenshot/photo of
   their payment (bank transfer, mobile wallet, etc.).
4. Order is created with status `pending` for the admin to confirm.

## Notes & things you may want to change

- **Payment flow is "manual proof upload"**, not a live payment gateway — this matches
  how a lot of small businesses in Pakistan and similar markets operate (bank
  transfer / JazzCash / EasyPaisa, then send screenshot). If you want a real gateway
  later (Stripe, PayFast, etc.), that's a separate integration on the checkout page
  and order route.
- Prices are formatted in PKR by default — change `VITE_CURRENCY` if you sell
  elsewhere.
- The admin session token is stored in `localStorage` and expires after
  `ADMIN_JWT_EXPIRES_IN` (default 7 days) — after that, the admin just logs in again.
