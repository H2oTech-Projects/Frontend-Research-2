import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface ChartParameters {
  data?: any;
}

const RTLineChart = ({data}: ChartParameters) => {
    data = [
      {
        name: 'Jan',
        acc_2024: 0.0,
        acc_2023: 0.0,
        acc_2022: 0.0,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Feb',
        acc_2024: 1.6,
        acc_2023: 1.6,
        acc_2022: 1.3,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Mar',
        acc_2024: 5.8,
        acc_2023: 6,
        acc_2022: 5.4,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Apr',
        acc_2024: 19.0,
        acc_2023: 19.9,
        acc_2022: 16.3,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'May',
        acc_2024: 43.6,
        acc_2023: 47.8,
        acc_2022: 40.3,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'June',
        acc_2024: 77.7,
        acc_2023: 82.6,
        acc_2022: 71.9,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Jul',
        acc_2024: 113.0,
        acc_2023: 121.7,
        acc_2022: 106.2,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Aug',
        acc_2024: 142.7,
        acc_2023: 153.7,
        acc_2022: 131.9,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Sep',
        acc_2024: 162.3,
        acc_2023: 175.2,
        acc_2022: 149.7,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Oct',
        acc_2024: 174.1,
        acc_2023: 188.3,
        acc_2022: 159.9,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Nov',
        acc_2024: 179.9,
        acc_2023: 194.8,
        acc_2022: 165.4,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
      {
        name: 'Dec',
        acc_2024: 182.5,
        acc_2023: 197.7,
        acc_2022: 167.6,
        total_allocation_2024: 197.7,
        total_allocation_2023: 182.5,
        total_allocation_2022: 167.6,
      },
    ];
    return (
      <ResponsiveContainer width="100%" height="100%">
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
          <XAxis dataKey="name" angle={-45} textAnchor="end"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="acc_2022"  textAnchor="end" stroke="#82ca9d" />
          <Line type="monotone" dataKey="acc_2023"  textAnchor="end" stroke="#82ca9d" />
          <Line type="monotone" dataKey="acc_2024"  textAnchor="end" stroke="#82ca9d" />

          <Line type="monotone" dataKey="total_allocation_2023"  textAnchor="end" stroke="red" name="2023 Allocation"/>
          <Line type="monotone" dataKey="total_allocation_2024"  textAnchor="end" stroke="blue" label="2024 Allocation"/>
          <Line type="monotone" dataKey="total_allocation_2022"  textAnchor="end" stroke="yellow" label="2022 Allocation"/>
        </LineChart>
      </ResponsiveContainer>
  );
};

export default RTLineChart;
