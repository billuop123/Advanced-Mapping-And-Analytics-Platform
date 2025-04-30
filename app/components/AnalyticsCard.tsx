

export function AnalyticsCard({title,value,Icon,color}:{title:string,value:number,Icon:React.ComponentType<{className?: string}> ,color:string }){
    return(
        <div className={`bg-gradient-to-br from-${color}-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 rounded-lg p-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
              <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
          </div>
          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">+{Math.floor(value * 0.05)}</span>
          </div>
        </div>
      </div>
    )
}