'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Save, Upload, Building2, Phone, Mail, MapPin, Globe } from 'lucide-react'

interface CompanyProfile {
  id?: string
  name: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  website?: string
  tin_number?: string
  logo_url?: string
  bank_name: string
  bank_account: string
  bank_code: string
  payment_terms: string
  created_at?: string
  updated_at?: string
}

export default function CompanyProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CompanyProfile>()

  // Mock company data - in real app, this would come from API
  const mockCompanyData: CompanyProfile = {
    id: '1',
    name: 'MOGENT TANZANIA LIMITED',
    address: 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    phone: '+255 22 286 0000',
    email: 'info@mogent.co.tz',
    website: 'www.mogent.co.tz',
    tin_number: '125-911-374',
    logo_url: '/api/placeholder/150/150',
    bank_name: 'CRDB Bank',
    bank_account: '0150691988500',
    bank_code: 'CRDBTZTZ',
    payment_terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  useEffect(() => {
    // Load company data
    loadCompanyProfile()
  }, [])

  const loadCompanyProfile = async () => {
    try {
      const response = await fetch('/api/company-profile')
      const data = await response.json()
      
      // Set form values
      Object.keys(data).forEach((key) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          setValue(key as keyof CompanyProfile, data[key as keyof CompanyProfile])
        }
      })
      
      if (data.logo_url) {
        setLogoPreview(data.logo_url)
      }
    } catch (error) {
      toast.error('Failed to load company profile')
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo file size must be less than 2MB')
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CompanyProfile) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/company-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update company profile')
      }
      
      const result = await response.json()
      toast.success(result.message || 'Company profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update company profile')
    } finally {
      setIsLoading(false)
    }
  }

  const companyData = watch()

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span className="breadcrumb">Settings</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb">Company Profile</span>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Logo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Logo</h3>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Upload your company logo (PNG, JPG, max 2MB)
                </p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                    className="btn-secondary text-sm"
                  >
                    Choose File
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Information
              </h3>
              
              <div>
                <label className="form-label">Company Name *</label>
                <input
                  {...register('name', { required: 'Company name is required' })}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter company name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Address *</label>
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  disabled={!isEditing}
                  className="input-field"
                  rows={3}
                  placeholder="Enter company address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">City *</label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter country"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">TIN Number</label>
                <input
                  {...register('tin_number')}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter TIN number"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              
              <div>
                <label className="form-label">Phone *</label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email *</label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Website</label>
                <input
                  {...register('website')}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter website URL"
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Bank Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Bank Name *</label>
                <input
                  {...register('bank_name', { required: 'Bank name is required' })}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter bank name"
                />
                {errors.bank_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.bank_name.message}</p>
                )}
              </div>
              
              <div>
                <label className="form-label">Account Number *</label>
                <input
                  {...register('bank_account', { required: 'Account number is required' })}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter account number"
                />
                {errors.bank_account && (
                  <p className="text-red-500 text-sm mt-1">{errors.bank_account.message}</p>
                )}
              </div>
              
              <div>
                <label className="form-label">Bank Code</label>
                <input
                  {...register('bank_code')}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Enter bank code"
                />
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Terms</h3>
            <div>
              <label className="form-label">Terms & Conditions</label>
              <textarea
                {...register('payment_terms')}
                disabled={!isEditing}
                className="input-field"
                rows={4}
                placeholder="Enter payment terms and conditions"
              />
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>

        {/* Preview Section */}
        {!isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{companyData.name}</p>
                  <p className="text-gray-600">{companyData.address}</p>
                  <p className="text-gray-600">{companyData.city}, {companyData.country}</p>
                  {companyData.tin_number && (
                    <p className="text-gray-600">TIN: {companyData.tin_number}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600">{companyData.phone}</p>
                  <p className="text-gray-600">{companyData.email}</p>
                  {companyData.website && (
                    <p className="text-gray-600">{companyData.website}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 