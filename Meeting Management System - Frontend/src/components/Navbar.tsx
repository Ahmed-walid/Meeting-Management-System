import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, CalendarClock, CheckSquare } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { path: '/', text: 'اجتماعات اليوم', icon: Calendar },
    { path: '/scheduled', text: 'الاجتماعات المجدولة', icon: CalendarClock },
    { path: '/completed', text: 'الاجتماعات المنتهية', icon: CheckSquare },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex justify-between w-full">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">نظام إدارة الاجتماعات</h1>
            </div>
            <div className="flex">
              {navItems.map(({ path, text, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-4 py-2 mx-2 text-sm font-medium ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  <Icon className="ml-2" size={20} />
                  {text}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}