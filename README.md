# MOGENT - Proforma Invoice Generator

A comprehensive business management system built with Next.js 14, TypeScript, and Supabase.

## ✅ Latest Update: All Build Issues Fixed!

All TypeScript compilation errors have been resolved and the application is now ready for production deployment.

## 🚀 Features

### Core Modules
- **Clients Module** - Manage customer information
- **Vendors Module** - Manage supplier information  
- **Items Module** - Manage inventory/products
- **Invoices Module** - Generate proforma invoices

### Advanced Features
- **Auto-generated Proforma Numbers** - Sequential numbering
- **Company Profile Management** - Edit company info and logo
- **A4 Print Optimization** - Perfect for printing
- **Responsive Design** - Works on all devices
- **Auto-push to GitHub** - Automatic version control

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/KodingMaster1/mogent.git
cd mogent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env.local` and update with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Run the database setup script in your Supabase SQL Editor
2. Copy the contents of `scripts/setup-database.sql`
3. Paste and execute in Supabase SQL Editor

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Vercel

Add these to your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://xuodlnombdgnzwtclxam.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1b2Rsbm9tYmRnbnp3dGNseGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODE5MjAsImV4cCI6MjA3MTg1NzkyMH0.fgnnYB0AMlF-CW54oamCi28jM2iFuXgrrT4LokWssQ0
```

## 📚 Documentation

- `DEPLOYMENT-GUIDE.md` - Complete deployment instructions
- `DATABASE-SETUP.md` - Database setup guide
- `AUTO-PUSH-GUIDE.md` - Auto-push functionality guide

## 🎯 Usage

1. **Setup Company Profile** - Go to Settings to configure your company information
2. **Add Clients** - Manage your customer database
3. **Add Vendors** - Manage your supplier database
4. **Add Items** - Manage your product inventory
5. **Generate Invoices** - Create professional proforma invoices
6. **Print/Export** - Print invoices or export as PDF

## 🔄 Auto-Push Scripts

The project includes automatic Git push functionality:

- `npm run auto-push` - Manual auto-push (Windows)
- `npm run auto-push-linux` - Manual auto-push (Linux/Mac)
- `npm run watch` - Continuous auto-push (Windows)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

---

**Built with ❤️ using Next.js, TypeScript, and Supabase** 