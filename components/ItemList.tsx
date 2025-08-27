'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'
import { supabase, mockData } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Item {
  id: string
  name: string
  description?: string
  sku: string
  category: string
  unit: string
  price: number
  cost: number
  stock_quantity: number
  min_stock_level: number
  vendor_id?: string
  vendor_name?: string
  created_at: string
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    let filtered = (Array.isArray(items) ? items : []).filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }, [searchTerm, selectedCategory, items])

  const fetchItems = async () => {
    try {
      setLoading(true)
      
      if (!supabase) {
        // Demo mode - use mock data
        setItems(mockData.items)
        toast.success('Demo mode: Using sample item data')
        return
      }

      const response = await fetch('/api/items')
      const data = await response.json()
      
      if (data.items && Array.isArray(data.items)) {
        setItems(data.items)
      } else if (Array.isArray(data)) {
        setItems(data)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to fetch items')
      // Fallback to mock data
      setItems(mockData.items)
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    if (!supabase) {
      toast.success('Demo mode: Item would be deleted')
      return
    }

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast.success('Item deleted successfully')
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete item')
      console.error('Error deleting item:', error)
    }
  }

  const getCategories = () => {
    const categories = [...new Set((Array.isArray(items) ? items : []).map(item => item.category))]
    return categories.sort()
  }

  const getLowStockItems = () => {
    return (Array.isArray(items) ? items : []).filter(item => item.stock_quantity <= item.min_stock_level)
  }

  const getTotalValue = () => {
    return (Array.isArray(items) ? items : []).reduce((sum, item) => sum + (item.stock_quantity * item.cost), 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6">
        <span className="breadcrumb">Dashboard</span>
        <ChevronRight className="breadcrumb-separator w-4 h-4" />
        <span className="text-gray-900 font-medium">Items</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Items</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <Link
            href="/items/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalValue())}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{getLowStockItems().length}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{getCategories().length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items by name, SKU, description, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Inventory List</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' ? 'No items found matching your criteria' : 'No items found'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Link href="/items/new" className="btn-primary">
                Add Your First Item
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Item</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header">Price</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell text-sm text-gray-900">
                      {item.sku}
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {item.stock_quantity} {item.unit}
                      </div>
                      {item.stock_quantity <= item.min_stock_level && (
                        <div className="text-xs text-red-600">
                          Low Stock
                        </div>
                      )}
                    </td>
                    <td className="table-cell text-sm text-gray-900">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="table-cell text-sm text-gray-500">
                      {item.vendor_name || 'N/A'}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/items/${item.id}`}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/items/${item.id}/edit`}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id)}
                          disabled={!supabase}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 