
# 📚 Fable – Ebook Sharing Platform (Client)

A modern full-stack ebook sharing platform where readers can discover and purchase ebooks, writers can publish and manage their work, and admins oversee the entire ecosystem.

## 🌐 Live URL
https://b13-assignment-10-client.vercel.app
## server repo link
https://github.com/rakibmur420-source/B13-assignment-10_server

## payment card number: 
4242 4242 4242 4242

day:-  12/34

## 👤 Admin Credentials

- **Email:** admin@fable.com
- **Password:** Admin@123

##  Key Features

-  Email/password and Google OAuth login (Firebase)
-  Three-role system: Reader, Writer, Admin
-  Browse, search, and filter ebooks by genre, price, availability
-  Stripe payment integration for ebook purchases
-  Bookmark ebooks for later
-  Role-specific dashboards with analytics
-  Dark mode support
-  Fully responsive design (mobile, tablet, desktop)
-  ImgBB API for cover image uploads
-  Framer Motion animations

##  Pages

| Page | Route |
|---|---|
| Home | `/` |
| Browse Ebooks | `/ebooks` |
| Ebook Details | `/ebooks/[id]` |
| Login | `/login` |
| Register | `/register` |
| Reader Dashboard | `/dashboard/reader` |
| Writer Dashboard | `/dashboard/writer` |
| Admin Dashboard | `/dashboard/admin` |
| Payment Success | `/payment/success` |

##  NPM Packages Used

| Package | Purpose |
|---|---|
| `next` | React framework (v14) |
| `react` | UI library |
| `axios` | HTTP requests |
| `firebase` | Google OAuth authentication |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icon library |
| `recharts` | Charts and analytics graphs |
| `framer-motion` | Animations |
| `next-themes` | Dark/light mode toggle |
| `tailwindcss` | Utility-first CSS framework |

##  Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=your_server_url
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

##  Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
