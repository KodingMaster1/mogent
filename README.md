# MOGENT Business Management System

A comprehensive business management system built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features include client management, vendor management, inventory tracking, and professional proforma invoice generation.

## 🚀 Features

### Core Modules
- **Dashboard**: Overview with key metrics and recent activities
- **Clients Management**: Add, edit, delete, and search clients
- **Vendors Management**: Manage supplier information
- **Inventory Management**: Track items, stock levels, and costs
- **Invoice Generation**: Create professional proforma invoices
- **Company Profile**: Manage company information and logo
- **Settings**: System configuration and preferences

### Invoice Features
- **Auto-generated Proforma Numbers**: Sequential numbering system
- **Professional Design**: A4 optimized layout for printing
- **Client Auto-complete**: Search and select clients with auto-fill
- **Item Management**: Dynamic item lists with calculations
- **Print & PDF Export**: Ready for professional printing
- **VAT Calculations**: Automatic tax calculations

### Technical Features
- **Responsive Design**: Works on all devices
- **Dark Green Theme**: Professional business appearance
- **Real-time Validation**: Form validation and error handling
- **Demo Mode**: Works without database setup
- **Auto-save**: Automatic file saving and version control

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **PDF**: jsPDF, html2canvas
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone git@github.com:KodingMaster1/mogent.git
   cd mogent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: The application works in demo mode without these variables.

### Database Setup (Optional)
1. Create a Supabase project
2. Run the SQL commands from `database-schema.sql`
3. Add environment variables
4. Restart the development server

## 🚀 Auto-Push Setup

### GitHub Actions (Automatic)
The repository includes GitHub Actions workflows that automatically:
- Build the project on push
- Run tests
- Auto-commit and push changes

### Local Auto-Push

#### Windows
```bash
npm run auto-push
```

#### Linux/Mac
```bash
npm run auto-push-linux
```

#### Manual Scripts
```bash
# Windows
scripts/auto-push.bat

# Linux/Mac
bash scripts/auto-push.sh
```

### VS Code Integration
1. **Auto-save**: Files are automatically saved after 1 second
2. **Tasks**: Use `Ctrl+Shift+P` → "Tasks: Run Task" → "Auto Push to GitHub"
3. **Keyboard Shortcuts**: 
   - `Ctrl+Shift+P` → "Git: Add All"
   - `Ctrl+Shift+P` → "Git: Commit"
   - `Ctrl+Shift+P` → "Git: Push"

## 📁 Project Structure

```
mogent/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── clients/           # Client pages
│   ├── vendors/           # Vendor pages
│   ├── items/             # Item pages
│   ├── invoices/          # Invoice pages
│   └── settings/          # Settings pages
├── components/            # React components
├── lib/                   # Utilities and configurations
├── scripts/               # Auto-push scripts
├── .github/               # GitHub Actions
└── .vscode/               # VS Code configuration
```

## 🎯 Key Components

### InvoiceForm
- Auto-generates proforma numbers
- Client search with auto-complete
- Dynamic item management
- Real-time calculations

### InvoicePreview
- A4 optimized layout
- Professional design
- Print-ready formatting
- PDF export capability

### CompanyProfile
- Logo upload functionality
- Company information management
- Bank details configuration
- Payment terms setup

## 🔄 Auto-Push Features

### Automatic Operations
- **File Monitoring**: Watches for file changes
- **Auto-commit**: Commits changes with timestamps
- **Auto-push**: Pushes to GitHub automatically
- **Change Logging**: Tracks modified files

### Manual Triggers
- **VS Code Tasks**: Built-in tasks for git operations
- **NPM Scripts**: Easy-to-use commands
- **Batch/Script Files**: Cross-platform compatibility

### Safety Features
- **Change Detection**: Only commits when changes exist
- **Error Handling**: Graceful failure handling
- **Status Reporting**: Clear success/error messages

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push
3. Environment variables are automatically configured

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Commit and push: `npm run auto-push`
6. Create a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the demo mode functionality

## 🎉 Demo Mode

The application includes a comprehensive demo mode that works without any database setup:
- Sample data for all modules
- Full functionality demonstration
- No configuration required
- Perfect for testing and evaluation

---

**Built with ❤️ for MOGENT TANZANIA LIMITED** 