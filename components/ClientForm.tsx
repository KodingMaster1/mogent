'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft, User, Mail, Phone, MapPin, Building, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface ClientFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tin_number?: string
  contact_person?: string
  notes?: string
}

export default function ClientForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: {
      country: 'Tanzania',
    },
  })

  const onSubmit = async (data: ClientFormData) => {
    setLoading(true)
    try {
      if (!supabase) {
        toast.success('Demo mode: Client would be saved')
        router.push('/clients')
        return
      }

      const { error } = await supabase
        .from('clients')
        .insert([data])

      if (error) throw error

      toast.success('Client added successfully!')
      router.push('/clients')
    } catch (error) {
      toast.error('Failed to add client')
      console.error('Error adding client:', error)
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
        <span className="breadcrumb">Clients</span>
        <ChevronRight className="breadcrumb-separator w-4 h-4" />
        <span className="text-gray-900 font-medium">Add New Client</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Client</h1>
        <p className="text-gray-600">Enter client information</p>
      </div>

      {/* Form */}
      <div className="card p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Client Name *</label>
                <input
                  {...register('name', { required: 'Client name is required' })}
                  className="input-field"
                  placeholder="Enter client name"
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
                  placeholder="client@example.com"
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
              <Building className="w-5 h-5 mr-2" />
              Additional Information
            </h2>
            <div>
              <label className="form-label">Notes</label>
              <textarea
                {...register('notes')}
                rows={4}
                className="input-field"
                placeholder="Any additional notes about this client..."
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
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 