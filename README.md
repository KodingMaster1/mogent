# Proforma Invoice Generator

A modern, full-stack web application for generating professional proforma invoices for MOGENT TANZANIA LIMITED. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🎨 **Exact Design Match**: Replicates the original invoice design 100%
- 📝 **Dynamic Form**: Add/remove items, automatic calculations
- 💾 **Database Storage**: Save invoices to Supabase
- 📄 **Print Ready**: Professional print formatting
- 📱 **Responsive Design**: Works on all devices
- 🔍 **Invoice History**: View and manage saved invoices
- ⚡ **Real-time Preview**: See changes instantly

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd proforma-invoice-generator
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create the following tables in your Supabase database:

#### Invoices Table
```sql
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_country TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  proforma_no INTEGER NOT NULL,
  tin_no TEXT NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  vat DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  remarks TEXT,
  account_name TEXT NOT NULL,
  account_no TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Invoice Items Table
```sql
CREATE TABLE invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  sn INTEGER NOT NULL,
  particulars TEXT NOT NULL,
  qty INTEGER NOT NULL,
  unit TEXT NOT NULL,
  price_per_unit DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Creating an Invoice

1. Navigate to the home page
2. Fill in customer information
3. Add invoice items (quantity, price, etc.)
4. Review the real-time preview
5. Click "Generate Invoice" to save
6. Use "Print Invoice" for professional output

### Viewing Invoice History

1. Click "Invoice History" in the navigation
2. Browse saved invoices
3. Click on any invoice to view details
4. Print individual invoices as needed

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Make sure to add the same environment variables in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── InvoiceForm.tsx    # Main form component
│   ├── InvoicePreview.tsx # Invoice preview
│   ├── InvoiceList.tsx    # Invoice history
│   └── Navigation.tsx     # Navigation bar
├── lib/                   # Utility functions
│   └── supabase.ts        # Supabase client
└── public/                # Static assets
```

## Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `app/globals.css` for custom styles
- Edit component styles in individual files

### Invoice Template
- Update `components/InvoicePreview.tsx` for layout changes
- Modify the MOTAL logo in CSS
- Adjust colors in Tailwind config

### Database Schema
- Add new fields to Supabase tables
- Update TypeScript interfaces in `lib/supabase.ts`
- Modify API routes accordingly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository. 