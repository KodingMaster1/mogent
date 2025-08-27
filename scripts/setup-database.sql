-- MOGENT Business Management System Database Setup
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
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

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
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

-- Items Table
CREATE TABLE IF NOT EXISTS items (
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

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
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

-- Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
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

-- Company Profile Table
CREATE TABLE IF NOT EXISTS company_profile (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(name);
CREATE INDEX IF NOT EXISTS idx_items_sku ON items(sku);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_invoices_proforma_no ON invoices(proforma_no);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at 
    BEFORE UPDATE ON vendors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profile_updated_at 
    BEFORE UPDATE ON company_profile 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default company profile
INSERT INTO company_profile (
    name, 
    address, 
    city, 
    country, 
    phone, 
    email, 
    website, 
    tin_number, 
    bank_name, 
    bank_account, 
    bank_code, 
    payment_terms
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
) ON CONFLICT DO NOTHING;

-- Insert sample data
INSERT INTO clients (name, email, phone, address, city, country, tin_number, contact_person) VALUES
('Hesu Investment Limited', 'info@hesu.co.tz', '+255 123 456 789', 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465', 'Dar es Salaam', 'Tanzania', '125-911-374', 'John Doe')
ON CONFLICT DO NOTHING;

INSERT INTO vendors (name, email, phone, address, city, country, tin_number, contact_person, business_type) VALUES
('Tech Supplies Ltd', 'info@techsupplies.co.tz', '+255 987 654 321', '123 Business Street, Industrial Area', 'Dar es Salaam', 'Tanzania', '456-789-123', 'Jane Smith', 'Technology Supplies')
ON CONFLICT DO NOTHING;

-- Get the vendor ID for items
DO $$
DECLARE
    vendor_id UUID;
BEGIN
    SELECT id INTO vendor_id FROM vendors WHERE name = 'Tech Supplies Ltd' LIMIT 1;
    
    IF vendor_id IS NOT NULL THEN
        INSERT INTO items (name, description, sku, category, cost, price, stock_quantity, min_stock_level, vendor_id) VALUES
        ('Toner - 106A', 'HP LaserJet 106A Compatible Toner Cartridge', 'TON-106A-001', 'Office Supplies', 120000, 150000, 50, 10, vendor_id),
        ('Toner - 151A', 'HP LaserJet 151A Compatible Toner Cartridge', 'TON-151A-001', 'Office Supplies', 250000, 300000, 30, 5, vendor_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Enable Row Level Security (RLS) - Optional
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;

-- Grant permissions (if using RLS)
-- CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON clients FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete access for all users" ON clients FOR DELETE USING (true);

-- Repeat for other tables as needed

-- Success message
SELECT 'Database setup completed successfully!' as status; 