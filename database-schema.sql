-- MOGENT TANZANIA LIMITED Business Management System
-- Complete Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CLIENTS TABLE
-- =============================================
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Tanzania',
  tin_number TEXT,
  contact_person TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VENDORS TABLE
-- =============================================
CREATE TABLE vendors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Tanzania',
  tin_number TEXT,
  contact_person TEXT,
  business_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ITEMS TABLE
-- =============================================
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  price DECIMAL(15,2) NOT NULL,
  cost DECIMAL(15,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 10,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVOICES TABLE
-- =============================================
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_country TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  proforma_no INTEGER NOT NULL UNIQUE,
  tin_no TEXT NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  vat DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  remarks TEXT,
  account_name TEXT NOT NULL,
  account_no TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVOICE ITEMS TABLE
-- =============================================
CREATE TABLE invoice_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  sn INTEGER NOT NULL,
  particulars TEXT NOT NULL,
  qty INTEGER NOT NULL,
  unit TEXT NOT NULL,
  price_per_unit DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Clients indexes
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_city ON clients(city);

-- Vendors indexes
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_vendors_email ON vendors(email);
CREATE INDEX idx_vendors_city ON vendors(city);

-- Items indexes
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_vendor_id ON items(vendor_id);

-- Invoices indexes
CREATE INDEX idx_invoices_proforma_no ON invoices(proforma_no);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);

-- Invoice items indexes
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_item_id ON invoice_items(item_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Sample Client
INSERT INTO clients (name, email, phone, address, city, country, tin_number, contact_person) VALUES
('Hesu Investment Limited', 'info@hesu.co.tz', '+255 123 456 789', 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465', 'Dar es Salaam', 'Tanzania', '125-911-374', 'John Doe');

-- Sample Vendor
INSERT INTO vendors (name, email, phone, address, city, country, tin_number, contact_person, business_type) VALUES
('Tech Supplies Ltd', 'info@techsupplies.co.tz', '+255 987 654 321', '123 Business Street, Industrial Area', 'Dar es Salaam', 'Tanzania', '456-789-123', 'Jane Smith', 'Technology Supplies');

-- Sample Items
INSERT INTO items (name, description, sku, category, unit, price, cost, stock_quantity, min_stock_level, vendor_id) VALUES
('Toner - 106A', 'HP LaserJet 106A Compatible Toner Cartridge', 'TON-106A-001', 'Office Supplies', 'pcs', 120000.00, 80000.00, 50, 10, (SELECT id FROM vendors LIMIT 1)),
('Toner - 151A', 'HP LaserJet 151A Compatible Toner Cartridge', 'TON-151A-001', 'Office Supplies', 'pcs', 300000.00, 200000.00, 25, 5, (SELECT id FROM vendors LIMIT 1));

-- =============================================
-- ROW LEVEL SECURITY (Optional for multi-tenant)
-- =============================================

-- Enable RLS if needed for multi-tenant setup
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY; 

-- Company Profile Table
CREATE TABLE IF NOT EXISTS company_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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