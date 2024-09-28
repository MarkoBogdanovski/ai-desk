

import React from 'react'
import { Button } from "@/components/ui/button"
import { Image, FileText, FileSearch, Mic } from "lucide-react"

const navItems = [
  { name: 'image', icon: Image },
  { name: 'document', icon: FileText },
  { name: 'summary', icon: FileSearch },
  { name: 'voice', icon: Mic },
]

export default function Navigation({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex space-x-2 p-1 bg-white shadow-sm rounded-md">
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant={activeTab === item.name ? "default" : "ghost"}
          className={`flex-1 ${activeTab === item.name ? '' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab(item.name)}
        >
          <item.icon className="w-4 h-4 mr-2" />
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Button>
      ))}
    </div>
  )
}
