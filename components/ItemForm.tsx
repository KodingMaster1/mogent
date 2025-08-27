'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft, Package, DollarSign, Building2, ChevronRight } from 'lucide-react'
import { supabase, mockData } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface ItemFormData {
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
}

interface Vendor {
  id: string
  name: string
}

export default function ItemForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormData>({
    defaultValues: {
      unit: 'pcs',
      stock_quantity: 0,
      min_stock_level: 10,
    },
  })

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      if (!supabase) {
        setVendors(mockData.vendors)
        return
      }

      const { data, error } = await supabase
        .from('vendors')
        .select('id, name')
        .order('name', { ascending: true })

      if (error) throw error
      setVendors(data || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
      setVendors(mockData.vendors)
    }
  }

  const onSubmit = async (data: ItemFormData) => {
    setLoading(true)
    try {
      if (!supabase) {
        toast.success('Demo mode: Item would be saved')
        router.push('/items')
        return
      }

      const { error } = await supabase
        .from('items')
        .insert([data])

      if (error) throw error

      toast.success('Item added successfully!')
      router.push('/items')
    } catch (error) {
      toast.error('Failed to add item')
      console.error('Error adding item:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="breadcrumb flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <ChevronRight className="breadcrumb-separator w-4 h-4" />
        <span className="breadcrumb">Items</span>
        <ChevronRight className="breadcrumb-separator w-4 h-4" />
        <span className="text-gray-900 font-medium">Add New Item</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Item</h1>
        <p className="text-gray-600">Enter item information for inventory management</p>
      </div>

      {/* Form */}
      <div className="card p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Item Name *</label>
                <input
                  {...register('name', { required: 'Item name is required' })}
                  className="input-field"
                  placeholder="Enter item name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">SKU *</label>
                <input
                  {...register('sku', { required: 'SKU is required' })}
                  className="input-field"
                  placeholder="Enter SKU code"
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Printing">Printing</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Unit</label>
                <input
                  {...register('unit')}
                  className="input-field"
                  placeholder="pcs, kg, units, etc."
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="form-label">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Enter item description..."
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Selling Price (TZS) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  className="input-field"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Cost Price (TZS) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('cost', { 
                    required: 'Cost is required',
                    min: { value: 0, message: 'Cost must be positive' }
                  })}
                  className="input-field"
                  placeholder="0.00"
                />
                {errors.cost && (
                  <p className="text-red-500 text-sm mt-1">{errors.cost.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Inventory Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="form-label">Current Stock *</label>
                <input
                  type="number"
                  {...register('stock_quantity', { 
                    required: 'Stock quantity is required',
                    min: { value: 0, message: 'Stock cannot be negative' }
                  })}
                  className="input-field"
                  placeholder="0"
                />
                {errors.stock_quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Minimum Stock Level *</label>
                <input
                  type="number"
                  {...register('min_stock_level', { 
                    required: 'Minimum stock level is required',
                    min: { value: 0, message: 'Minimum stock cannot be negative' }
                  })}
                  className="input-field"
                  placeholder="10"
                />
                {errors.min_stock_level && (
                  <p className="text-red-500 text-sm mt-1">{errors.min_stock_level.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Vendor</label>
                <select
                  {...register('vendor_id')}
                  className="input-field"
                >
                  <option value="">Select vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 