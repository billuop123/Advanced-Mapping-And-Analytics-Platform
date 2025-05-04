"use client"
import { Users, Upload, User, LayoutDashboard, FileImage, ChartBar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnalyticsCard } from "./AnalyticsCard"
import { useTheme } from "next-themes" // Import useTheme hook

interface AnalyticsSidebarProps {
  totalUsers: number;
  totalSVGs: number;
  adminName: string;
  adminEmail: string;
  adminImage: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function AnalyticsSidebar({ 
  totalUsers, 
  totalSVGs, 
  adminName, 
  adminEmail,
  adminImage,
  isOpen,
  onToggle 
}: AnalyticsSidebarProps) {
  const { theme, setTheme } = useTheme() // Access theme state
  
  return (
    <aside className={`bg-white dark:bg-black shadow-lg transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'} h-full flex flex-col fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 z-10`}>

      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {isOpen ? (
          <h2 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-indigo-500" />
            <span>Analytics</span>
          </h2>
        ) : (
          <div className="w-full flex justify-center">
            <ChartBar className="h-5 w-5 text-indigo-500" />
          </div>
        )}
      </div>


      <div className="relative">
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute -right-3 top-16 z-20 rounded-full shadow-md h-6 w-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="h-3 w-3 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-600 dark:text-slate-400" />
          )}
        </Button>
      </div>

 
      {isOpen ? (
        <div className="flex flex-col h-full">

          <div className="p-4 space-y-4">
        
          
            <AnalyticsCard title="Total Users" value={totalUsers} Icon={Users} color="emerald" />
            <AnalyticsCard title="Total SVGs" value={totalSVGs} Icon={Upload} color="black" />
          </div>
          <nav className="p-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Management
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admindashboard/" 
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-2 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm">View All Users</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/admindashboard/uploadFile" 
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-2 transition-colors"
                >
                  <FileImage className="h-4 w-4" />
                  <span className="text-sm">Upload SVG</span>
                </Link>
              </li>
            </ul>
          </nav>
          

          <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={adminImage}
                  alt={adminName}
                  fill
                  className="rounded-full object-cover border-2 border-white dark:border-slate-700"
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{adminName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{adminEmail}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 h-full">
       
          <div className="space-y-6 mb-6">
        
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 rounded-lg flex flex-col items-center justify-center">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{totalUsers}</span>
            </div>
            
      
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-emerald-950 rounded-lg flex flex-col items-center justify-center">
              <Upload className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{totalSVGs}</span>
            </div>
          </div>
          
         
          <nav className="flex flex-col items-center space-y-4">
            <Link 
              href="/admindashboard/"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="View All Users"
            >
              <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </Link>
            <Link 
              href="/admindashboard/uploadFile"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="View All SVGs"
            >
              <FileImage className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </Link>
          </nav>
         
          <div className="mt-auto">
            <div className="relative h-8 w-8 mx-auto">
              <Image
                src={adminImage}
                alt={adminName}
                fill
                className="rounded-full object-cover border-2 border-white dark:border-slate-700"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Theme toggle button */}
      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-between p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-300">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-slate-700">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        </div>
      )}
      
      {/* Small toggle for collapsed sidebar */}
      {!isOpen && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="mt-4 p-2 mx-auto rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-300">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-700">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
    </aside>
  );
}