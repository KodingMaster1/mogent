# 🗄️ Database Setup Guide for MOGENT Project

This guide will help you set up your Supabase database for the MOGENT Business Management System.

## 📋 Prerequisites

- ✅ Supabase account created
- ✅ Project created in Supabase
- ✅ Your credentials (already provided)

## 🔧 Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `xuodlnombdgnzwtclxam`

## 🗄️ Step 2: Set Up Database Tables

### Option A: Using SQL Editor (Recommended)

1. **Open SQL Editor**
   - In your Supabase dashboard, go to **SQL Editor**
   - Click **New Query**

2. **Run the Setup Script**
   - Copy the entire content from `scripts/setup-database.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute the script

3. **Verify Setup**
   - Go to **Table Editor** in the left sidebar
   - You should see the following tables:
     - `clients`
     - `vendors`
     - `items`
     - `invoices`
     - `invoice_items`
     - `company_profile`

### Option B: Manual Table Creation

If you prefer to create tables manually, follow these steps:

#### 1. Create Clients Table
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    tin_number VARCHAR(50),
    contact_person VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. Create Vendors Table
```sql
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    tin_number VARCHAR(50),
    contact_person VARCHAR(255),
    business_type VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Create Items Table
```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    category VARCHAR(100),
    cost DECIMAL(15,2) NOT NULL DEFAULT 0,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER NOT NULL DEFAULT 0,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. Create Invoices Table
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_country VARCHAR(255) NOT NULL,
    invoice_date DATE NOT NULL,
    proforma_no VARCHAR(50) NOT NULL UNIQUE,
    tin_no VARCHAR(50) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    vat DECIMAL(15,2) NOT NULL DEFAULT 0,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,
    remarks TEXT,
    account_name VARCHAR(255) NOT NULL,
    account_no VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. Create Invoice Items Table
```sql
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    sn INTEGER NOT NULL,
    particulars TEXT NOT NULL,
    qty INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(15,2) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. Create Company Profile Table
```sql
CREATE TABLE company_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    tin_number VARCHAR(50),
    logo_url TEXT,
    bank_name VARCHAR(255) NOT NULL,
    bank_account VARCHAR(100) NOT NULL,
    bank_code VARCHAR(50),
    payment_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Step 3: Configure Row Level Security (Optional)

If you want to enable Row Level Security for better data protection:

1. **Enable RLS on Tables**
```sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
```

2. **Create Policies**
```sql
-- Example policy for clients table
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON clients FOR DELETE USING (true);
```

## 📊 Step 4: Insert Sample Data

After creating the tables, insert some sample data:

```sql
-- Insert default company profile
INSERT INTO company_profile (
    name, address, city, country, phone, email, website, tin_number, 
    bank_name, bank_account, bank_code, payment_terms
) VALUES (
    'MOGENT TANZANIA LIMITED',
    'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465',
    'Dar es Salaam',
    'Tanzania',
    '+255 22 286 0000',
    'info@mogent.co.tz',
    'www.mogent.co.tz',
    '125-911-374',
    'CRDB Bank',
    '0150691988500',
    'CRDBTZTZ',
    'Payment is due within 30 days of invoice date. Late payments may incur additional charges.'
);

-- Insert sample client
INSERT INTO clients (name, email, phone, address, city, country, tin_number, contact_person) VALUES
('Hesu Investment Limited', 'info@hesu.co.tz', '+255 123 456 789', 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465', 'Dar es Salaam', 'Tanzania', '125-911-374', 'John Doe');

-- Insert sample vendor
INSERT INTO vendors (name, email, phone, address, city, country, tin_number, contact_person, business_type) VALUES
('Tech Supplies Ltd', 'info@techsupplies.co.tz', '+255 987 654 321', '123 Business Street, Industrial Area', 'Dar es Salaam', 'Tanzania', '456-789-123', 'Jane Smith', 'Technology Supplies');
```

## 🔧 Step 5: Test Database Connection

1. **Start the Development Server**
```bash
npm run dev
```

2. **Check Console Output**
   - Look for: "Supabase connected successfully"
   - No more "Demo mode" warnings

3. **Test Features**
   - Go to Clients page - should load real data
   - Go to Vendors page - should load real data
   - Go to Items page - should load real data
   - Create a new invoice - should save to database

## 🚨 Troubleshooting

### Issue 1: "Connection failed"
**Solution**: Check your environment variables are correct

### Issue 2: "Table does not exist"
**Solution**: Run the setup script again

### Issue 3: "Permission denied"
**Solution**: Check RLS policies if enabled

### Issue 4: "Demo mode still showing"
**Solution**: Restart the development server after setting up environment variables

## 📈 Database Schema Overview

### Tables Structure:

#### `clients`
- Customer information management
- Contact details and addresses
- TIN numbers for tax purposes

#### `vendors`
- Supplier information
- Business type classification
- Contact details

#### `items`
- Inventory management
- Stock levels and pricing
- Vendor relationships

#### `invoices`
- Invoice header information
- Customer and payment details
- Totals and tax calculations

#### `invoice_items`
- Individual line items
- Quantities and pricing
- Links to invoices

#### `company_profile`
- Company information
- Bank details
- Logo and branding

## 🎯 Next Steps

After successful database setup:

1. **Test All Features**
   - Create, edit, delete clients
   - Manage vendors and items
   - Generate invoices
   - Update company profile

2. **Customize Data**
   - Add your real clients
   - Update company information
   - Configure payment terms

3. **Deploy to Production**
   - Set up environment variables in Vercel
   - Deploy the application
   - Test production functionality

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/using-sql-editor)

---

**Database setup completed! 🎉**

Your MOGENT Business Management System is now connected to a real database and ready for production use. 