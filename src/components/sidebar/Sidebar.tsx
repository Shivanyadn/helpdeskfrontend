import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Ticket, 
  MessageSquare, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/agent' },
    { icon: Ticket, label: 'Tickets', href: '/tickets/agent' },
    { icon: MessageSquare, label: 'Chat', href: '/chat' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help', href: '/help' },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-10 ${
        isOpen ? 'w-[250px]' : 'w-[80px]'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <div className="flex items-center">
          {isOpen ? (
            <h1 className="text-xl font-bold text-indigo-600">Helpdesk</h1>
          ) : (
            <span className="text-xl font-bold text-indigo-600">🔧</span>
          )}
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <div className="py-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.href}
                className={`flex items-center px-4 py-3 ${
                  pathname === item.href 
                    ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                } transition-colors`}
              >
                <item.icon size={20} className="min-w-[20px]" />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="absolute bottom-0 w-full border-t border-slate-200 py-4">
        <Link 
          href="/"
          className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <LogOut size={20} className="min-w-[20px]" />
          {isOpen && <span className="ml-3">Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;