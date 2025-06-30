import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import RTLineChart from '../components/charts/lineChart';
import BasicSelect, { GeneralSelect } from "@/components/BasicSelect";
interface ChartParameters {
  data?: any;
}

const TableLineChartInfo = ({ data }: ChartParameters) => {
  // console.log(data?.tableInfo,"test data");
  return (
    // <div className="flex-col w-full h-full">
    //   <div className="flex justify-left gap-2">
    //     <span className="pt-[5px] text-black">Year: </span>
    //       <GeneralSelect itemList={
    //       [{
    //           "value": '40',
    //           "label": "2026 Falls 01"
    //       },
    //       {
    //           "value": '42',
    //           "label": "2026 Falls 02"
    //       }]} label={'Year'} Value={'40'} setValue={()=> {alert('maka')}}/>
    //   </div>

    //   <div className="flex flex-row w-full h-full">
    //     {/* <div className="basis-2/5 w-full h-full bg-[#16599a]">{data.tableInfo}</div> */}
    //     <div className="basis-3/5 w-full h-full"><RTLineChart/></div>
    //   </div>
    // </div>
    <div className='p-1 h-full w-full flex gap-2'>
      <div className='flex w-1/3 justify-end flex-col gap-2 text-black dark:text-white '>
        <BasicSelect label='Year' Value="40" showLabel={false} setValue={() => console.log("test")} itemList={
          [{
            value: "40",
            label: "2026 Falls 01"
          },
          {
            value: '42',
            label: "2026 Falls 02"
          }]
        } />
        <div className='flex flex-grow flex-col gap-1 pl-1 text-white'>
            <div>Parcel ID : {data?.tableInfo?.parcel_id}</div>
            <div>Account ID : {data?.tableInfo?.account_id}</div>
            <div>Farm Zone : {data?.tableInfo?.zone_name}</div>
            <div>Zone Abr : {data?.tableInfo?.zone_abr}</div>
            <div>Allocation (AF) : 13</div>
            <div>Primary Crop : {data?.tableInfo?.primary_crop}</div>
            <div>Sustainable Yield Acreage (AC) :12</div>
            <div>Carryover (AF) : 3.2</div>
            <div>Remaining (AF) : 2.3 </div>
            <div>Remaining (%) : 20%</div>
            <div>Transitional Water Acreage (AC) : 13</div>
            <div>Total Allocation (AF) : 5.6</div>
        </div>
      </div>
      <div className='flex w-2/3 h-full text-white'>
        <RTLineChart />
      </div>


    </div>

  );
};

export default TableLineChartInfo;
