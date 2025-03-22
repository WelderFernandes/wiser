'use client'
import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'

interface MenuItem {
  label: string
  icon: LucideIcon
  subItems?: MenuItem[]
}

interface SidemenuProps {
  items: MenuItem[]
}

const Sidemenu: React.FC<SidemenuProps> = ({ items }) => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label)
  }

  return (
    <div className="w-64 bg-gray-800 text-white h-full shadow-lg p-4">
      <h2 className="text-lg font-bold mb-4 text-center">Menu</h2>
      <ul>
        {items.map((item) => (
          <li key={item.label} className="mb-2">
            <div
              className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition duration-200"
              onClick={() => item.subItems && toggleSubMenu(item.label)}
            >
              <item.icon className="mr-2 text-xl" />
              {item.label}
            </div>
            {item.subItems && openSubMenu === item.label && (
              <ul className="ml-4 mt-1">
                {item.subItems.map((subItem) => (
                  <li key={subItem.label} className="mb-1">
                    <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 transition duration-200">
                      <subItem.icon className="mr-2 text-lg" />
                      {subItem.label}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidemenu
