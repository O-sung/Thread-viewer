# Thread Viewer Website

Beautiful mobile-friendly website to view and copy your AI-generated Twitter threads.

## 🚀 Quick Start

### Local Development

```bash
cd thread-viewer
npm install
npm run dev
```

Visit `http://localhost:3000`

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

See [full deployment guide](../vercel_deployment.md) for details.

## 📱 Features

- Mobile-optimized design
- One-tap copy to clipboard
- Auto-refresh for new threads
- Color-coded confidence scores
- Beautiful gradient UI

## 🔧 Environment Variables

Create `.env.local`:

```
DATABASE_URL=your_mysql_connection_string
```

## 📊 Database Connection

For Vercel deployment, use a cloud database:
- PlanetScale (recommended)
- Railway
- Supabase

Local MySQL won't work on Vercel.

## 🎨 Tech Stack

- Next.js 14
- React 18
- MySQL2
- CSS-in-JS

---

Built for @Temi_Creept's Twitter automation system
