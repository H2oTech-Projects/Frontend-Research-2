import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import RTLineChart from '../components/charts/LineChart';
import {GeneralSelect} from "@/components/BasicSelect";
interface ChartParameters {
  data?: any;
}

const TableLineChartInfo = ({data}: ChartParameters) => {
  return (
    <div className="flex-col w-full h-full">
      <div className="flex justify-left gap-2">
        <span className="pt-[5px] text-black">Year: </span>
          <GeneralSelect itemList={
          [{
              "value": '40',
              "label": "2026 Falls 01"
          },
          {
              "value": '42',
              "label": "2026 Falls 02"
          }]} label={'Year'} Value={'40'} setValue={()=> {alert('maka')}}/>
      </div>

      <div className="flex flex-row w-full h-full">
        <div className="basis-2/5 w-full h-full bg-[#16599a]">{data.tableInfo}</div>
        <div className="basis-3/5 w-full h-full"><RTLineChart/></div>
      </div>
    </div>
  );
};

export default TableLineChartInfo;
