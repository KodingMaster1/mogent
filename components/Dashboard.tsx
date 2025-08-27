'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Building2, 
  Package, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Plus,
  Eye,
  ChevronRight
} from 'lucide-react'
import { supabase, mockData } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalClients: number
  totalVendors: number
  totalItems: number
  totalInvoices: number
  totalRevenue: number
  recentInvoices: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalVendors: 0,
    totalItems: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    recentInvoices: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not configured
        setStats({
          totalClients: mockData.clients.length,
          totalVendors: mockData.vendors.length,
          totalItems: mockData.items.length,
          totalInvoices: mockData.invoices.length,
          totalRevenue: mockData.invoices.reduce((sum, invoice) => sum + invoice.total, 0),
          recentInvoices: mockData.invoices.slice(0, 5)
        })
        setLoading(false)
        return
      }

      // Fetch counts from all tables
      const [clients, vendors, items, invoices] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact' }),
        supabase.from('vendors').select('*', { count: 'exact' }),
        supabase.from('items').select('*', { count: 'exact' }),
        supabase.from('invoices').select('*', { count: 'exact' })
      ])

      // Fetch recent invoices
      const { data: recentInvoices } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Calculate total revenue
      const { data: allInvoices } = await supabase
        .from('invoices')
        .select('total')

      const totalRevenue = allInvoices?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0

      setStats({
        totalClients: clients.count || 0,
        totalVendors: vendors.count || 0,
        totalItems: items.count || 0,
        totalInvoices: invoices.count || 0,
        totalRevenue,
        recentInvoices: recentInvoices || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to mock data on error
      setStats({
        totalClients: mockData.clients.length,
        totalVendors: mockData.vendors.length,
        totalItems: mockData.items.length,
        totalInvoices: mockData.invoices.length,
        totalRevenue: mockData.invoices.reduce((sum, invoice) => sum + invoice.total, 0),
        recentInvoices: mockData.invoices.slice(0, 5)
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6">
        <Link href="/" className="breadcrumb">Dashboard</Link>
        <ChevronRight className="breadcrumb-separator w-4 h-4" />
        <span className="text-gray-900 font-medium">Overview</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to MOGENT TANZANIA LIMITED Business Management System
        </p>
        {!supabase && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Demo Mode:</strong> Using sample data. Set up Supabase to enable full functionality.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Building2 size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVendors}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Package size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FileText size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/clients/new"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={20} className="text-blue-600 mr-3" />
              <span className="text-gray-700">Add New Client</span>
            </Link>
            
            <Link
              href="/vendors/new"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={20} className="text-green-600 mr-3" />
              <span className="text-gray-700">Add New Vendor</span>
            </Link>
            
            <Link
              href="/items/new"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={20} className="text-purple-600 mr-3" />
              <span className="text-gray-700">Add New Item</span>
            </Link>
            
            <Link
              href="/invoices"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText size={20} className="text-orange-600 mr-3" />
              <span className="text-gray-700">Create New Invoice</span>
            </Link>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h2>
          {stats.recentInvoices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent invoices</p>
          ) : (
            <div className="space-y-3">
              {stats.recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      #{invoice.proforma_no} - {invoice.customer_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(invoice.invoice_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(invoice.total)}
                    </p>
                    <Link
                      href={`/invoice-history/${invoice.id}`}
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 