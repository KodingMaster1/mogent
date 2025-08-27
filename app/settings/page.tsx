'use client'

import { useState } from 'react'
import CompanyProfile from '@/components/CompanyProfile'
import { Settings, Building2, User, Shield, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')

  const settingsTabs = [
    {
      id: 'company',
      name: 'Company Profile',
      icon: Building2,
      description: 'Manage company information and logo'
    },
    {
      id: 'account',
      name: 'Account Settings',
      icon: User,
      description: 'User account preferences'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Password and security settings'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Email and notification preferences'
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyProfile />
      case 'account':
        return (
          <div className="p-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <span className="breadcrumb">Settings</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb">Account Settings</span>
            </div>
            <div className="card p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
              <p className="text-gray-600">Account settings functionality coming soon...</p>
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="p-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <span className="breadcrumb">Settings</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb">Security</span>
            </div>
            <div className="card p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h1>
              <p className="text-gray-600">Security settings functionality coming soon...</p>
            </div>
          </div>
        )
      case 'notifications':
        return (
          <div className="p-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <span className="breadcrumb">Settings</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb">Notifications</span>
            </div>
            <div className="card p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h1>
              <p className="text-gray-600">Notification settings functionality coming soon...</p>
            </div>
          </div>
        )
      default:
        return <CompanyProfile />
    }
  }

  return (
    <div className="flex h-full">
      {/* Settings Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Settings className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        
        <nav className="space-y-2">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{tab.name}</div>
                  <div className="text-xs text-gray-500">{tab.description}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  )
} 