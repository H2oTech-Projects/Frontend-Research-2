import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface ChartParameters {
  data?: any;
  way?: string;
  isColusa?: boolean;
}

const RTLineChart = ({ data, way, isColusa=false }: ChartParameters) => {
  data = !isColusa ? [
    {
      name: 'Jan',
      acc_2024: 0.0,
      acc_2023: 0.0,
      acc_2022: 0.0,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Feb',
      acc_2024: 1.6,
      acc_2023: 1.6,
      acc_2022: 1.3,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Mar',
      acc_2024: 5.8,
      acc_2023: 6,
      acc_2022: 5.4,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Apr',
      acc_2024: 19.0,
      acc_2023: 19.9,
      acc_2022: 16.3,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'May',
      acc_2024: 43.6,
      acc_2023: 47.8,
      acc_2022: 40.3,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Jun',
      acc_2024: 77.7,
      acc_2023: 82.6,
      acc_2022: 71.9,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Jul',
      acc_2024: 113.0,
      acc_2023: 121.7,
      acc_2022: 106.2,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Aug',
      acc_2024: 142.7,
      acc_2023: 153.7,
      acc_2022: 131.9,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Sep',
      acc_2024: 162.3,
      acc_2023: 175.2,
      acc_2022: 149.7,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Oct',
      acc_2024: 174.1,
      acc_2023: 188.3,
      acc_2022: 159.9,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Nov',
      acc_2024: 179.9,
      acc_2023: 194.8,
      acc_2022: 165.4,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Dec',
      acc_2024: 182.5,
      acc_2023: 197.7,
      acc_2022: 167.6,
      total_allocation_2024: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
  ] : [
    {
      name: 'Jan',
      acc_2025: 0.0,
      acc_2023: 0.0,
      acc_2022: 0.0,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Feb',
      acc_2025: 1.6,
      acc_2023: 1.6,
      acc_2022: 1.3,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Mar',
      acc_2025: 5.8,
      acc_2023: 6,
      acc_2022: 5.4,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Apr',
      acc_2025: 19.0,
      acc_2023: 19.9,
      acc_2022: 16.3,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'May',
      acc_2025: 43.6,
      acc_2023: 47.8,
      acc_2022: 40.3,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Jun',
      acc_2025: 77.7,
      acc_2023: 82.6,
      acc_2022: 71.9,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Jul',
      acc_2025: 113.0,
      acc_2023: 121.7,
      acc_2022: 106.2,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Aug',
      acc_2025: 142.7,
      acc_2023: 153.7,
      acc_2022: 131.9,
      total_allocation_2025: 197.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Sep',
      acc_2023: 175.2,
      acc_2022: 149.7,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Oct',
      acc_2023: 188.3,
      acc_2022: 159.9,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Nov',
      acc_2023: 194.8,
      acc_2022: 165.4,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
    {
      name: 'Dec',
      acc_2023: 197.7,
      acc_2022: 167.6,
      total_allocation_2023: 182.5,
      total_allocation_2022: 167.6,
      total_allocation: 206.2,
      allocation_2024: 173.4
    },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%" >
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-40} textAnchor="end" tick={{ fill: 'white' }} interval={0} />
        <YAxis name='Volume (AF)' label={{ value: 'Volume (AF)', angle: -90, position: 'insideLeft', style: { fill: 'white' } }} tick={{ fill: 'white' }} />
        <Tooltip
          labelFormatter={(label) => {
            return <div className='text-black font-bold underline '>{`${label} ${way}`}</div>;
          }}
          formatter={(value: any, name: any) => [`${value}`, name]}
          contentStyle={{ border: '1px solid #ccc', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ paddingTop: 16 }} />
        <Line type="monotone" dataKey={`acc_${way}`} textAnchor="end" stroke="#0096FF" name={`${way} ETAW`} strokeWidth={2}/>
        <Line type="monotone" dataKey="acc_2022" textAnchor="end" strokeDasharray="8 4 2 4" stroke="gray" name="Low (2022)" strokeWidth={2}/>
        <Line type="monotone" dataKey="acc_2023" textAnchor="end" strokeDasharray="8 8" stroke="gray" name="High (2023)" strokeWidth={2}/>
        <Line type="monotone" dataKey="allocation_2024" strokeDasharray="5 5" textAnchor="end" stroke="orange" name="2024 Allocation" strokeWidth={2}/>
        <Line type="monotone" dataKey="total_allocation" textAnchor="end" stroke="red" name="Total Allocation" strokeWidth={2}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RTLineChart;
