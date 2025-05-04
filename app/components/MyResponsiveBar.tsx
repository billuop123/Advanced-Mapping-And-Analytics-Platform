import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from "next-themes"

export const MyResponsiveBar = ({ data2 }: { data2: any }) => {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <ResponsiveBar
      data={data2}
      keys={['total']}
      indexBy="role"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: isDarkMode ? 'dark2' : 'nivo' }}
      theme={{
        text: {
          fill: isDarkMode ? '#ffffff' : '#333333',
          fontSize: 11,
        },
        axis: {
          domain: {
            line: {
              stroke: isDarkMode ? '#555555' : '#dddddd',
            },
          },
          ticks: {
            line: {
              stroke: isDarkMode ? '#777777' : '#cccccc',
              strokeWidth: 1,
            },
            text: {
              fill: isDarkMode ? '#eeeeee' : '#333333',
              fontSize: 11,
            },
          },
          legend: {
            text: {
              fill: isDarkMode ? '#ffffff' : '#333333',
              fontSize: 12,
            },
          },
        },
        grid: {
          line: {
            stroke: isDarkMode ? '#444444' : '#eeeeee',
          },
        },
        tooltip: {
          container: {
            background: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#333333',
            border: isDarkMode ? '1px solid #444' : '1px solid #ddd',
          },
        },
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Location type',
        legendPosition: 'middle',
        legendOffset: 32,
        truncateTickAt: 0
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Count',
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', isDarkMode ? 1.2 : 1.6]]
      }}
      role="application"
      ariaLabel="Role Distribution Chart"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in role: ${e.indexValue}`}
    />
  )
}