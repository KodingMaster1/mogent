'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft, Building2, Mail, Phone, MapPin, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface VendorFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tin_number?: string
  contact_person?: string
  business_type?: string
  notes?: string
}

export default function VendorForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorFormData>({
    defaultValues: {
      country: 'Tanzania',
    },
  })

  const onSubmit = async (data: VendorFormData) => {
    setLoading(true)
    try {
      if (!supabase) {
        toast.success('Demo mode: Vendor would be saved')
        router.push('/vendors')
        return
      }

      const { error } = await supabase
        .from('vendors')
        .insert([data])

      if (error) throw error

      toast.success('Vendor added successfully!')
      router.push('/vendors')
    } catch (error) {
      toast.error('Failed to add vendor')
      console.error('Error adding vendor:', error)
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
        <span className="breadcrumb">Vendors</span>
        <ChevronRight className="breadcrumb-separator w-4 h-4" />
        <span className="text-gray-900 font-medium">Add New Vendor</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Vendor</h1>
        <p className="text-gray-600">Enter vendor information</p>
      </div>

      {/* Form */}
      <div className="card p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Vendor Name *</label>
                <input
                  {...register('name', { required: 'Vendor name is required' })}
                  className="input-field"
                  placeholder="Enter vendor name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Contact Person</label>
                <input
                  {...register('contact_person')}
                  className="input-field"
                  placeholder="Primary contact person"
                />
              </div>

              <div>
                <label className="form-label">Business Type</label>
                <select
                  {...register('business_type')}
                  className="input-field"
                >
                  <option value="">Select business type</option>
                  <option value="Technology Supplies">Technology Supplies</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Printing Services">Printing Services</option>
                  <option value="Electronics">Electronics</option>
                  <option value="General Trading">General Trading</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">TIN Number</label>
                <input
                  {...register('tin_number')}
                  className="input-field"
                  placeholder="Tax Identification Number"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field"
                  placeholder="vendor@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Phone Number *</label>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  className="input-field"
                  placeholder="+255 123 456 789"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="form-label">Street Address *</label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  className="input-field"
                  placeholder="Enter street address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">City *</label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    className="input-field"
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Country *</label>
                  <input
                    {...register('country', { required: 'Country is required' })}
                    className="input-field"
                    placeholder="Enter country"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Additional Information
            </h2>
            <div>
              <label className="form-label">Notes</label>
              <textarea
                {...register('notes')}
                rows={4}
                className="input-field"
                placeholder="Any additional notes about this vendor..."
              />
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
              className="btn-success flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 