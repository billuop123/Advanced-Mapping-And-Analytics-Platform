"use client"
import { Users, Upload, User, LayoutDashboard, FileImage, ChartBar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnalyticsCard } from "./AnalyticsCard"


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
  return (
    <aside className={`bg-white dark:bg-slate-900 shadow-lg transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'} h-full flex flex-col fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 z-10`}>

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
            <AnalyticsCard title="Total SVGs" value={totalSVGs} Icon={Upload} color="blue" />
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
    </aside>
  );
}