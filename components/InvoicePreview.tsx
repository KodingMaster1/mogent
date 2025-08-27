'use client'

import { Invoice } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/supabase'
import { Printer, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface InvoicePreviewProps {
  invoice: Invoice
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    toast.success('Demo mode: PDF download would be generated')
  }

  return (
    <div className="invoice-container bg-white border border-gray-200 rounded-lg overflow-hidden print:w-[210mm] print:h-[297mm] print:mx-auto print:my-0 print:border-none print:shadow-none">
      {/* Header with Company Info */}
      <div className="bg-white text-gray-900 p-4 print:p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-1 print:text-2xl text-gray-900">MOGENT TANZANIA LIMITED</h1>
            <p className="text-gray-600 text-xs print:text-sm">Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465</p>
            <p className="text-gray-600 text-xs print:text-sm">Dar es Salaam, Tanzania</p>
            <p className="text-gray-600 text-xs print:text-sm">Tel: +255 22 286 0000 | Email: info@mogent.co.tz</p>
          </div>
          <div className="text-right ml-4">
            <div className="bg-green-800 text-white px-3 py-1 rounded-lg mb-3 print:mb-4 print:px-4 print:py-2">
              <span className="font-bold text-sm print:text-lg">MOGENT</span>
            </div>
            {/* Print and Download Buttons */}
            <div className="flex gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-green-800 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium hover:bg-green-700 transition-colors"
                title="Print Invoice"
              >
                <Printer className="w-3 h-3" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="bg-gray-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium hover:bg-gray-500 transition-colors"
                title="Download PDF"
              >
                <Download className="w-3 h-3" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="bg-red-600 text-white p-3 text-center print:p-4">
        <h2 className="text-lg font-bold print:text-xl">PROFORMA INVOICE</h2>
      </div>

      {/* Invoice Details */}
      <div className="p-4 print:p-6 space-y-4 print:space-y-6">
        {/* Customer and Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-6">
          {/* Customer Information */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-base print:text-lg">Bill To:</h3>
            <div className="bg-gray-50 p-3 rounded-lg print:p-4 border border-gray-200">
              <p className="font-medium text-gray-900 text-sm print:text-base">{invoice.customer_name}</p>
              <p className="text-gray-600 text-xs print:text-sm">{invoice.customer_address}</p>
              <p className="text-gray-600 text-xs print:text-sm">{invoice.customer_country}</p>
            </div>
          </div>

          {/* Invoice Information */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-base print:text-lg">Invoice Details:</h3>
            <div className="bg-gray-50 p-3 rounded-lg space-y-1 print:p-4 print:space-y-2 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600 text-xs print:text-sm">Date:</span>
                <span className="font-medium text-xs print:text-sm">{formatDate(invoice.invoice_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-xs print:text-sm">Proforma No:</span>
                <span className="font-medium text-xs print:text-sm">{invoice.proforma_no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-xs print:text-sm">TIN No:</span>
                <span className="font-medium text-xs print:text-sm">{invoice.tin_no}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-2 print:space-y-3">
          <h3 className="font-semibold text-gray-900 text-base print:text-lg">Items:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-xs print:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="table-header w-12 print:w-16 text-xs print:text-xs border-r border-gray-300">S/N</th>
                  <th className="table-header text-xs print:text-xs border-r border-gray-300">Particulars</th>
                  <th className="table-header w-16 print:w-20 text-xs print:text-xs border-r border-gray-300">Qty</th>
                  <th className="table-header w-16 print:w-20 text-xs print:text-xs border-r border-gray-300">Unit</th>
                  <th className="table-header w-24 print:w-32 text-xs print:text-xs border-r border-gray-300">Price/Unit</th>
                  <th className="table-header w-24 print:w-32 text-xs print:text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="table-cell text-center text-xs print:text-sm border-r border-gray-300">{item.sn}</td>
                    <td className="table-cell text-xs print:text-sm border-r border-gray-300">{item.particulars}</td>
                    <td className="table-cell text-center text-xs print:text-sm border-r border-gray-300">{item.qty}</td>
                    <td className="table-cell text-center text-xs print:text-sm border-r border-gray-300">{item.unit}</td>
                    <td className="table-cell text-right text-xs print:text-sm border-r border-gray-300">{formatCurrency(item.price_per_unit)}</td>
                    <td className="table-cell text-right highlight-cell text-xs print:text-sm font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 print:w-80 space-y-1 print:space-y-2">
            <div className="flex justify-between text-gray-600 text-xs print:text-sm">
              <span>Sub Total:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-xs print:text-sm">
              <span>Tax. Vit (18%):</span>
              <span>{formatCurrency(invoice.vat)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-xs print:text-sm">
              <span>Discount 5%:</span>
              <span>{formatCurrency(invoice.subtotal * 0.05)}</span>
            </div>
            <div className="flex justify-between text-base print:text-lg font-bold text-red-600 border-t-2 border-red-600 pt-1 print:pt-2 bg-red-50 print:bg-red-50 px-2 py-1 print:px-2 print:py-1 rounded">
              <span>Grand Total:</span>
              <span>{formatCurrency(invoice.total - (invoice.subtotal * 0.05))}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {invoice.remarks && (
          <div className="space-y-1 print:space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm print:text-base">Remarks:</h3>
            <p className="text-gray-600 bg-gray-50 p-2 rounded-lg text-xs print:text-sm print:p-3 border border-gray-200">{invoice.remarks}</p>
          </div>
        )}

        {/* Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-6">
          <div className="space-y-1 print:space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm print:text-base">Payment Method:</h3>
            <div className="bg-gray-50 p-2 rounded-lg print:p-4 border border-gray-200">
              <p className="text-gray-600 text-xs print:text-sm">Bank Account</p>
              <p className="text-gray-600 text-xs print:text-sm">Bank Fullname</p>
              <p className="text-gray-600 text-xs print:text-sm">Bank Code</p>
            </div>
          </div>

          <div className="space-y-1 print:space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm print:text-base">Bank Details:</h3>
            <div className="bg-gray-50 p-2 rounded-lg print:p-4 border border-gray-200">
              <p className="font-medium text-gray-900 text-xs print:text-sm">{invoice.account_name}</p>
              <p className="text-gray-600 text-xs print:text-sm">Account No: {invoice.account_no}</p>
              <p className="text-gray-600 text-xs print:text-sm">Bank: CRDB Bank</p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-1 print:space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm print:text-base">Terms & Condition:</h3>
          <div className="bg-gray-50 p-2 rounded-lg print:p-4 border border-gray-200">
            <p className="text-gray-600 text-xs print:text-sm">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. sed diam nonummy nibh</p>
            <p className="text-gray-600 text-xs print:text-sm mt-1">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.</p>
          </div>
        </div>

        {/* Footer with Signature */}
        <div className="border-t border-gray-200 pt-3 print:pt-6">
          <div className="flex justify-between items-end">
            <div className="text-center text-gray-500 text-xs print:text-sm">
              <div className="mb-2">
                <span className="text-red-500 text-lg">♥</span>
              </div>
              <p className="font-medium">Steven Joe</p>
              <p className="text-gray-600">Accounting Manager</p>
            </div>
            <div className="text-center text-gray-500 text-xs print:text-sm">
              <p>Thank you for your business!</p>
              <p>For any queries, please contact us at info@mogent.co.tz</p>
              <p className="mt-1">0123456789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 