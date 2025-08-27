'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Phone,
  Mail,
  MapPin,
  Package
} from 'lucide-react'
import { supabase, mockData } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tin_number?: string
  contact_person?: string
  business_type?: string
  created_at: string
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    const filtered = (Array.isArray(vendors) ? vendors : []).filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone.includes(searchTerm) ||
      vendor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.business_type?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  const fetchVendors = async () => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not configured
        setVendors(mockData.vendors)
        setLoading(false)
        return
      }

      const response = await fetch('/api/vendors')
      const data = await response.json()
      
      if (data.vendors && Array.isArray(data.vendors)) {
        setVendors(data.vendors)
      } else if (Array.isArray(data)) {
        setVendors(data)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      // Fallback to mock data on error
      setVendors(mockData.vendors)
      toast.error('Failed to fetch vendors - using demo data')
    } finally {
      setLoading(false)
    }
  }

  const deleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return

    if (!supabase) {
      toast.error('Demo mode: Cannot delete in demo mode')
      return
    }

    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast.success('Vendor deleted successfully')
      fetchVendors()
    } catch (error) {
      toast.error('Failed to delete vendor')
      console.error('Error deleting vendor:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors</h1>
            <p className="text-gray-600">Manage your supplier database</p>
            {!supabase && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-xs">
                  Demo Mode: Using sample data
                </p>
              </div>
            )}
          </div>
          <Link
            href="/vendors/new"
            className="btn-success flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Vendor
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search vendors by name, email, phone, city, or business type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Building2 size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendors List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vendor Directory</h2>
          </div>
          
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No vendors found matching your search' : 'No vendors found'}
              </p>
              {!searchTerm && (
                <Link href="/vendors/new" className="btn-success">
                  Add Your First Vendor
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TIN Number
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.name}
                          </div>
                          {vendor.contact_person && (
                            <div className="text-sm text-gray-500">
                              Contact: {vendor.contact_person}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            {vendor.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone size={14} className="mr-2 text-gray-400" />
                            {vendor.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin size={14} className="mr-2 text-gray-400" />
                            {vendor.city}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vendor.country}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vendor.business_type || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vendor.tin_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/vendors/${vendor.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/vendors/${vendor.id}/edit`}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => deleteVendor(vendor.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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
    </div>
  )
} 