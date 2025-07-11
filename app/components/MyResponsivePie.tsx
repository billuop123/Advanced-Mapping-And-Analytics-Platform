import { ResponsivePie } from '@nivo/pie'
import { useTheme } from "next-themes"

export const MyResponsivePie = ({ data }: { data: any }) => {
  const { theme } = useTheme()
  
  const isDarkMode = theme === 'dark'

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]]
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={isDarkMode ? '#ffffff' : '#333333'}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', isDarkMode ? 0.5 : 2]]
      }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      fill={[
        {
          match: { id: 'ruby' },
          id: 'dots'
        },
        {
          match: { id: 'c' },
          id: 'dots'
        },
        {
          match: { id: 'go' },
          id: 'dots'
        },
        {
          match: { id: 'python' },
          id: 'dots'
        },
        {
          match: { id: 'scala' },
          id: 'lines'
        },
        {
          match: { id: 'lisp' },
          id: 'lines'
        },
        {
          match: { id: 'elixir' },
          id: 'lines'
        },
        {
          match: { id: 'javascript' },
          id: 'lines'
        }
      ]}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: isDarkMode ? '#aaaaaa' : '#999999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: isDarkMode ? '#ffffff' : '#000000'
              }
            }
          ]
        }
      ]}
      theme={{
        tooltip: {
          container: {
            background: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#333333',
          }
        }
      }}
    />
  )
}