'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, FileText, ChevronRight, Save, Search } from 'lucide-react'
import { Invoice, InvoiceItem } from '@/lib/supabase'
import InvoicePreview from './InvoicePreview'
import toast from 'react-hot-toast'

interface InvoiceFormData {
  customer_name: string
  customer_address: string
  customer_country: string
  invoice_date: string
  proforma_no: string
  tin_no: string
  items: InvoiceItem[]
  remarks: string
  account_name: string
  account_no: string
}

interface Client {
  id: string
  name: string
  address: string
  country: string
  tin_number?: string
}

export default function InvoiceForm() {
  const [showPreview, setShowPreview] = useState(false)
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientSearch, setShowClientSearch] = useState(false)
  const [clientSearchTerm, setClientSearchTerm] = useState('')
  const [nextProformaNo, setNextProformaNo] = useState(1) // New state for auto-generated proforma number

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      customer_name: 'Hesu Investment Limited',
      customer_address: 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465',
      customer_country: 'Dar es Salaam, Tanzania',
      invoice_date: new Date().toISOString().split('T')[0],
      proforma_no: '1', // Set default value
      tin_no: '125-911-374',
      items: [
        {
          sn: 1,
          particulars: 'Toner - 106A',
          qty: 2,
          unit: 'pcs',
          price_per_unit: 120000,
          total: 240000,
        },
        {
          sn: 2,
          particulars: 'Toner - 151A',
          qty: 2,
          unit: 'pcs',
          price_per_unit: 300000,
          total: 600000,
        },
      ],
      remarks: 'Being sale of toners',
      account_name: 'MOGENT TANZANIA LIMITED',
      account_no: '0150691988500',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = watch('items')

  // Load clients on component mount
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      // Handle the API response format
      if (data.clients && Array.isArray(data.clients)) {
        setClients(data.clients)
      } else if (Array.isArray(data)) {
        setClients(data)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (error) {
      console.error('Error loading clients:', error)
      // Use mock data if API fails
      setClients([
        {
          id: '1',
          name: 'Hesu Investment Limited',
          address: 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465',
          country: 'Dar es Salaam, Tanzania',
          tin_number: '125-911-374'
        },
        {
          id: '2',
          name: 'Tech Solutions Ltd',
          address: '123 Innovation Street, Tech District',
          country: 'Nairobi, Kenya',
          tin_number: '456-789-012'
        },
        {
          id: '3',
          name: 'Global Trading Co',
          address: '456 Business Avenue, Commerce Plaza',
          country: 'Kampala, Uganda',
          tin_number: '789-012-345'
        }
      ])
    }
  }

  const generateNextProformaNo = async () => {
    try {
      // In a real app, you would fetch the last proforma number from the database
      // For demo, we'll use a simple increment
      const response = await fetch('/api/invoices')
      const invoices = await response.json()
      const lastInvoice = invoices[invoices.length - 1]
      const lastNumber = lastInvoice ? parseInt(lastInvoice.proforma_no) : 0
      const nextNumber = lastNumber + 1
      setNextProformaNo(nextNumber)
      setValue('proforma_no', nextNumber.toString())
    } catch (error) {
      // Fallback to current timestamp-based number
      const timestamp = Date.now()
      const number = Math.floor(timestamp / 1000) % 10000
      setNextProformaNo(number)
      setValue('proforma_no', number.toString())
    }
  }

  const selectClient = (client: Client) => {
    setSelectedClient(client)
    setValue('customer_name', client.name)
    setValue('customer_address', client.address)
    setValue('customer_country', client.country)
    if (client.tin_number) {
      setValue('tin_no', client.tin_number)
    }
    setShowClientSearch(false)
    setClientSearchTerm('')
  }

  const filteredClients = (Array.isArray(clients) ? clients : []).filter(client =>
  client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
  client.address.toLowerCase().includes(clientSearchTerm.toLowerCase())
)

  // Calculate totals when items change
  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
    const vat = subtotal * 0.18
    const total = subtotal + vat
    return { subtotal, vat, total }
  }

  // Update item total when qty or price changes
  const updateItemTotal = (index: number) => {
    const item = watchedItems[index]
    if (item.qty && item.price_per_unit) {
      const total = item.qty * item.price_per_unit
      setValue(`items.${index}.total`, total)
    }
  }

  // Auto-update totals when items change
  useEffect(() => {
    if (watchedItems && watchedItems.length > 0) {
      watchedItems.forEach((_, index) => {
        updateItemTotal(index)
      })
    }
  }, [watchedItems])

  // Generate next proforma number on component mount
  useEffect(() => {
    generateNextProformaNo()
  }, [])

  // Close client search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.client-search-container')) {
        setShowClientSearch(false)
      }
    }

    if (showClientSearch) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showClientSearch])

  const addItem = () => {
    const newSn = watchedItems.length + 1
    append({
      sn: newSn,
      particulars: '',
      qty: 1,
      unit: 'pcs',
      price_per_unit: 0,
      total: 0,
    })
  }

  const removeItem = (index: number) => {
    if (watchedItems.length <= 1) {
      toast.error('At least one item is required')
      return
    }
    
    remove(index)
    // Update serial numbers
    setTimeout(() => {
      watchedItems.forEach((_, idx) => {
        setValue(`items.${idx}.sn`, idx + 1)
      })
    }, 100)
  }

  const onSubmit = async (data: InvoiceFormData) => {
    setIsGenerating(true)
    
    try {
      // Validate that a client is selected
      if (!selectedClient) {
        toast.error('Please select a client')
        return
      }

      // Validate that at least one item has data
      const validItems = data.items.filter(item => 
        item.particulars && item.qty > 0 && item.price_per_unit > 0
      )
      
      if (validItems.length === 0) {
        toast.error('Please add at least one valid item')
        return
      }

      const { subtotal, vat, total } = calculateTotals(data.items)
      
      const invoice: Invoice = {
        ...data,
        subtotal,
        vat,
        total,
        id: `inv_${Date.now()}`, // Generate temporary ID
        created_at: new Date().toISOString()
      }
      
      setInvoiceData(invoice)
      setShowPreview(true)
      toast.success('Invoice generated successfully!')
      
      // Scroll to preview
      setTimeout(() => {
        const previewElement = document.getElementById('invoice-preview')
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      
    } catch (error) {
      toast.error('Failed to generate invoice')
      console.error('Error generating invoice:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!invoiceData) {
      toast.error('No invoice to save')
      return
    }
    
    toast.success('Demo mode: Invoice would be saved to database')
  }

  const getTotals = () => {
    return calculateTotals(watchedItems)
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6">
        <span className="breadcrumb">Dashboard</span>
        <ChevronRight className="breadcrumb-separator w-4 h-4" />
        <span className="text-gray-900 font-medium">Create Invoice</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Proforma Invoice</h1>
        <p className="text-gray-600">Generate professional proforma invoices for your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Invoice Details
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Customer Information
              </h3>
              
              <div className="client-search-container">
                <label className="form-label">Select Client *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search and select a client..."
                    value={selectedClient ? selectedClient.name : ''}
                    onClick={() => setShowClientSearch(true)}
                    readOnly
                    className={`input-field cursor-pointer ${selectedClient ? 'bg-green-50 border-green-300' : ''}`}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                {/* Selected Client Info */}
                {selectedClient && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm">
                      <p className="font-medium text-green-800">{selectedClient.name}</p>
                      <p className="text-green-600">{selectedClient.address}</p>
                      <p className="text-green-600">{selectedClient.country}</p>
                      {selectedClient.tin_number && (
                        <p className="text-green-600">TIN: {selectedClient.tin_number}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Client Search Dropdown */}
                {showClientSearch && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={clientSearchTerm}
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                    </div>
                    <div className="py-1">
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => selectClient(client)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                          >
                            <div className="font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.address}</div>
                            {client.tin_number && (
                              <div className="text-xs text-gray-400">TIN: {client.tin_number}</div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500">No clients found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Invoice Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    {...register('invoice_date', { required: 'Date is required' })}
                    className="input-field"
                  />
                  {errors.invoice_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoice_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Proforma No *</label>
                  <input
                    type="text"
                    {...register('proforma_no', { 
                      required: 'Proforma number is required'
                    })}
                    className="input-field bg-gray-100"
                    placeholder="Auto-generated"
                    readOnly
                  />
                  {errors.proforma_no && (
                    <p className="text-red-500 text-sm mt-1">{errors.proforma_no.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">TIN No *</label>
                  <input
                    {...register('tin_no', { required: 'TIN number is required' })}
                    className="input-field"
                    placeholder="Enter TIN number"
                  />
                  {errors.tin_no && (
                    <p className="text-red-500 text-sm mt-1">{errors.tin_no.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-800 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Items
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="btn-success flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="col-span-1">
                      <input
                        {...register(`items.${index}.sn` as const)}
                        className="input-field text-center text-sm bg-white"
                        readOnly
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        {...register(`items.${index}.particulars` as const, {
                          required: 'Particulars is required',
                        })}
                        placeholder="Particulars"
                        className="input-field text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        {...register(`items.${index}.qty` as const, {
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Quantity must be at least 1' },
                        })}
                        type="number"
                        placeholder="Qty"
                        className="input-field text-sm"
                        onChange={() => updateItemTotal(index)}
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        {...register(`items.${index}.unit` as const)}
                        placeholder="Unit"
                        className="input-field text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        {...register(`items.${index}.price_per_unit` as const, {
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be positive' },
                        })}
                        type="number"
                        placeholder="Price"
                        className="input-field text-sm"
                        onChange={() => updateItemTotal(index)}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        {...register(`items.${index}.total` as const)}
                        placeholder="Total"
                        className="input-field text-sm bg-green-50 font-medium"
                        readOnly
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full h-8 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center text-sm transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Totals */}
              {watchedItems.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Totals:</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Subtotal:</span>
                      <span className="font-medium ml-2">TZS {getTotals().subtotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">VAT (18%):</span>
                      <span className="font-medium ml-2">TZS {getTotals().vat.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Total:</span>
                      <span className="font-bold ml-2 text-blue-900">TZS {getTotals().total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Additional Information
              </h3>
              
              <div>
                <label className="form-label">Remarks</label>
                <textarea
                  {...register('remarks')}
                  className="input-field"
                  rows={3}
                  placeholder="Enter any additional remarks..."
                />
              </div>

              <div>
                <label className="form-label">Account Name *</label>
                <input
                  {...register('account_name', { required: 'Account name is required' })}
                  className="input-field"
                  placeholder="Enter account name"
                />
                {errors.account_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.account_name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Account No *</label>
                <input
                  {...register('account_no', { required: 'Account number is required' })}
                  className="input-field"
                  placeholder="Enter account number"
                />
                {errors.account_no && (
                  <p className="text-red-500 text-sm mt-1">{errors.account_no.message}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Invoice'}
              </button>
              
              {showPreview && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-success flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Invoice
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div id="invoice-preview" className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            Invoice Preview
          </h2>
          
          {showPreview && invoiceData ? (
            <InvoicePreview invoice={invoiceData} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">Fill in the form and click "Generate Invoice" to see the preview</p>
              <p className="text-sm">The preview will show exactly how your invoice will look when printed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 