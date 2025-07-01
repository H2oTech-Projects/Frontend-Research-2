import { useState } from 'react'
import RTLineChart from '../components/charts/lineChart';
import BasicSelect, { GeneralSelect } from "@/components/BasicSelect";
import { Download } from 'lucide-react';
interface ChartParameters {
  data?: any;
}

const TableLineChartInfo = ({ data }: ChartParameters) => {
  // console.log(data?.tableInfo,"test data");
  const [way, setWay] = useState("2024")
  const table_2024 = () => {
    return (
      <table className="dataframe text-white w-full border-separate border-spacing-x-3 -ml-2">
        <thead>
          <tr >
            <th className='text-left'>Year</th>
            <th className='text-left'>Month</th>
            <th className='text-right'>ETAW (AF)</th>
            <th className='text-right'>Cumulative ETAW (AF)</th>
            <th className='text-right'>Remaining (AF)</th>
            <th className='text-right'>Remaining (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Jan</td>
            <td className="text-right">0.0</td>
            <td className="text-right">0.0</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Feb</td>
            <td className="text-right">1.6</td>
            <td className="text-right">1.6</td>
            <td className="text-right">204.6</td>
            <td className="text-right">99.2%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Mar</td>
            <td className="text-right">4.2</td>
            <td className="text-right">5.8</td>
            <td className="text-right">200.4</td>
            <td className="text-right">97.2%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Apr</td>
            <td className="text-right">13.2</td>
            <td className="text-right">19.0</td>
            <td className="text-right">187.2</td>
            <td className="text-right">90.8%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">May</td>
            <td className="text-right">24.6</td>
            <td className="text-right">43.6</td>
            <td className="text-right">162.6</td>
            <td className="text-right">78.9%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Jun</td>
            <td className="text-right">34.1</td>
            <td className="text-right">77.7</td>
            <td className="text-right">128.5</td>
            <td className="text-right">62.3%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Jul</td>
            <td className="text-right">35.3</td>
            <td className="text-right">113.0</td>
            <td className="text-right">93.2</td>
            <td className="text-right">45.2%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Aug</td>
            <td className="text-right">29.7</td>
            <td className="text-right">142.7</td>
            <td className="text-right">63.5</td>
            <td className="text-right">30.8%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Sep</td>
            <td className="text-right">19.6</td>
            <td className="text-right">162.3</td>
            <td className="text-right">43.9</td>
            <td className="text-right">21.3%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Oct</td>
            <td className="text-right">11.7</td>
            <td className="text-right">174.1</td>
            <td className="text-right">32.1</td>
            <td className="text-right">15.6%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Nov</td>
            <td className="text-right">5.9</td>
            <td className="text-right">179.9</td>
            <td className="text-right">26.3</td>
            <td className="text-right">12.7%</td>
          </tr>
          <tr>
            <td className="text-left">2024</td>
            <td className="text-left">Dec</td>
            <td className="text-right">2.6</td>
            <td className="text-right">182.5</td>
            <td className="text-right">23.7</td>
            <td className="text-right">11.5%</td>
          </tr>
        </tbody>
      </table>
    )
  }
  const table_2023 = () => {
    return (
      <table className="dataframe text-white w-full border-separate border-spacing-x-3 -ml-2">
        <thead>
          <tr >
            <th className='text-left'>Year</th>
            <th className='text-left'>Month</th>
            <th className='text-right'>ETAW (AF)</th>
            <th className='text-right'>Cumulative ETAW (AF)</th>
            <th className='text-right'>Remaining (AF)</th>
            <th className='text-right'>Remaining (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Jan</td>
            <td className="text-right">0.0</td>
            <td className="text-right">0.0</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Feb</td>
            <td className="text-right">1.7</td>
            <td className="text-right">1.7</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Mar</td>
            <td className="text-right">4.7</td>
            <td className="text-right">6.4</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Apr</td>
            <td className="text-right">14.3</td>
            <td className="text-right">20.7</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">May</td>
            <td className="text-right">27.3</td>
            <td className="text-right">48.0</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Jun</td>
            <td className="text-right">38.7</td>
            <td className="text-right">86.7</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Jul</td>
            <td className="text-right">39.7</td>
            <td className="text-right">126.3</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Aug</td>
            <td className="text-right">31.6</td>
            <td className="text-right">157.9</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Sep</td>
            <td className="text-right">21.0</td>
            <td className="text-right">179.0</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Oct</td>
            <td className="text-right">12.2</td>
            <td className="text-right">191.2</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Nov</td>
            <td className="text-right">6.7</td>
            <td className="text-right">197.9</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2023</td>
            <td className="text-left">Dec</td>
            <td className="text-right">2.6</td>
            <td className="text-right">200.5</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
        </tbody>

      </table>
    )
  }

  const table_2022 = () => {
    return (
      <table className="dataframe text-white  border-separate border-spacing-x-3 -ml-2">
        <thead>
           <tr >
            <th className='text-left'>Year</th>
            <th className='text-left'>Month</th>
            <th className='text-right'>ETAW (AF)</th>
            <th className='text-right'>Cumulative ETAW (AF)</th>
            <th className='text-right'>Remaining (AF)</th>
            <th className='text-right'>Remaining (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Jan</td>
            <td className="text-right">0.0</td>
            <td className="text-right">0.0</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Feb</td>
            <td className="text-right">1.3</td>
            <td className="text-right">1.3</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Mar</td>
            <td className="text-right">3.9</td>
            <td className="text-right">5.2</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Apr</td>
            <td className="text-right">13.1</td>
            <td className="text-right">18.3</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">May</td>
            <td className="text-right">23.0</td>
            <td className="text-right">41.3</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Jun</td>
            <td className="text-right">29.3</td>
            <td className="text-right">70.5</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Jul</td>
            <td className="text-right">34.3</td>
            <td className="text-right">104.9</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Aug</td>
            <td className="text-right">26.5</td>
            <td className="text-right">131.4</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Sep</td>
            <td className="text-right">16.7</td>
            <td className="text-right">148.2</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Oct</td>
            <td className="text-right">11.1</td>
            <td className="text-right">159.3</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Nov</td>
            <td className="text-right">5.8</td>
            <td className="text-right">165.1</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
          <tr>
            <td className="text-left">2022</td>
            <td className="text-left">Dec</td>
            <td className="text-right">2.4</td>
            <td className="text-right">167.5</td>
            <td className="text-right">206.2</td>
            <td className="text-right">100.0%</td>
          </tr>
        </tbody>

      </table>
    )
  }
  const showTable = () => {
    if (way == '2022') return table_2022();
    if (way == '2023') return table_2023();
    if (way == '2024') return table_2024();
  }
  return (
    <div className='p-1 h-full w-full flex gap-4'>
      <div className='flex w-2/5 justify-end flex-col gap-2 text-black dark:text-white '>
        <div className='flex justify-between items-center'>   <BasicSelect label='Year' Value={way} showLabel={false} setValue={(value) => setWay(value)} itemList={
          [{
            value: "2024",
            label: "2024"
          },
          {
            value: '2023',
            label: "2023"
          },
          {
            value: '2022',
            label: "2022"
          }]
        } />
          <Download className="inline-block items-baseline ml-2 cursor-pointer" size={24} />
        </div>
        <div className='flex flex-grow flex-col gap-1 pl-1 text-white'>
          <div>Parcel ID: XXX-XXX-XXX</div>
          <div>Account ID: MAD_MA_XXXXX</div>
          <div>Farm Unit Zone: {data?.tableInfo?.zone_name}</div>
          <div>Primary Crop: Pistachios</div>
          <div>2024 Allocation (AF): 173.4</div>
          <div>Carryover (AF): 22.5</div>
          <div>Total Allocation (AF): 206.2</div>
          <div>Sustainable Yield Acreage (AC): 75.9</div>
          <div>Transitional Water Acreage (AC): 74.3</div>

        </div>
        {showTable()}
        <div>

        </div>
      </div>
      <div className='flex w-3/5 h-full text-white'>
        <RTLineChart way={way} />
      </div>
    </div>
  );
};

export default TableLineChartInfo;
