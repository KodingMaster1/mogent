'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Users, 
  Building2, 
  Package, 
  FileText, 
  History,
  Settings,
  ChevronRight,
  Bell,
  BarChart3,
  Star,
  UserCheck
} from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/vendors', label: 'Vendors', icon: Building2 },
    { href: '/items', label: 'Items', icon: Package },
    { href: '/invoices', label: 'Invoices', icon: FileText },
    { href: '/invoice-history', label: 'Invoice History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const additionalItems = [
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/reports', label: 'Saved Reports', icon: Star },
    { href: '/users', label: 'User Reports', icon: UserCheck },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-green-800 text-white transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-green-700">
            {sidebarExpanded && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-800 font-bold text-sm">M</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">MOGENT</h1>
                  <p className="text-xs text-green-200">TANZANIA LIMITED</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-1 rounded hover:bg-green-700 transition-colors"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${sidebarExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="sidebar-icon" />
                  {sidebarExpanded && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Additional Items */}
          <div className="p-4 border-t border-green-700">
            <div className="space-y-2">
              {additionalItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="sidebar-item"
                  >
                    <Icon className="sidebar-icon" />
                    {sidebarExpanded && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-green-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              {sidebarExpanded && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-green-200">admin@mogent.co.tz</p>
                </div>
              )}
              <Link href="/settings" className="p-1 rounded hover:bg-green-700 transition-colors">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {/* Content will be rendered here */}
        </div>
      </div>
    </div>
  )
} 