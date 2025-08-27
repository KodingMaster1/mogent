# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies (Already Done!)
```bash
npm install
```

### 2. Environment Variables (Optional)
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** If you don't set these variables, the app will run in demo mode with sample data.

### 3. Set Up Supabase (Optional for Full Features)
If you want to save data to database:

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the URL and anon key
5. Paste them in your `.env.local` file
6. Run the SQL commands from `database-schema.sql` in your Supabase SQL editor

### 4. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 What You'll See

- **Dashboard**: Business overview with statistics
- **Clients**: Manage customer database
- **Vendors**: Manage supplier database  
- **Items**: Inventory management
- **Invoices**: Create proforma invoices (100% like your image)
- **Invoice History**: View saved invoices

## 🔧 Features Working Right Now

✅ **Demo Mode** - Works without database setup  
✅ **Dashboard** - Shows sample data and statistics  
✅ **Invoice Generator** - Creates invoices exactly like your image  
✅ **Print Function** - Professional print formatting  
✅ **Responsive Design** - Works on all devices  
✅ **MOTAL Logo** - Exact replica with red/blue arcs  

## 📝 Next Steps

1. **Test the application** - Create some sample invoices
2. **Set up Supabase** - For saving data (optional)
3. **Deploy to Vercel** - For production use
4. **Customize** - Modify colors, layout, or branding

## 🆘 Troubleshooting

**If you see "supabaseUrl is required" error:**
- The app will now work in demo mode automatically
- Set up environment variables for full database features

**For database features:**
- Set up Supabase project
- Add environment variables
- Run database schema SQL

**The application is ready to use!** 🎉 