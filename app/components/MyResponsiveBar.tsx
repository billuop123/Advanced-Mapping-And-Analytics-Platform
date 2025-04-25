
import { ResponsiveBar } from '@nivo/bar'


export const MyResponsiveBar = ({ data2 }: { data2: any }) => (
    <ResponsiveBar
      data={data2}
      keys={['total']} 
      indexBy="role"  
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
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
        modifiers: [['darker', 1.6]]
      }}
      role="application"
      ariaLabel="Role Distribution Chart"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in role: ${e.indexValue}`}
    />
  );