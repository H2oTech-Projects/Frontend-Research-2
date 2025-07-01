import  { useState } from 'react'
import RTLineChart from '../components/charts/lineChart';
import BasicSelect, { GeneralSelect } from "@/components/BasicSelect";
interface ChartParameters {
  data?: any;
}

const TableLineChartInfo = ({ data }: ChartParameters) => {
  // console.log(data?.tableInfo,"test data");
  const [way, setWay] = useState("2024")
  const table_2024 = () => {
    return (
      <table className="dataframe text-[white]">
        <thead>
          <tr >
            <th>Year</th>
            <th>Month</th>
            <th>ETAW (AF)</th>
            <th>Cumulative ETAW (AF)</th>
            <th>Remaining (AF)</th>
            <th>Remaining (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2024</td><td>Jan</td><td>0.0</td><td>0.0</td><td>206.2</td><td>100.0%</td></tr>
          <tr><td>2024</td><td>Feb</td><td>1.6</td><td>1.6</td><td>204.6</td><td>99.2%</td></tr>
          <tr><td>2024</td><td>Mar</td><td>4.2</td><td>5.8</td><td>200.4</td><td>97.2%</td></tr>
          <tr><td>2024</td><td>Apr</td><td>13.2</td><td>19.0</td><td>187.2</td><td>90.8%</td></tr>
          <tr><td>2024</td><td>May</td><td>24.6</td><td>43.6</td><td>162.6</td><td>78.9%</td></tr>
          <tr><td>2024</td><td>Jun</td><td>34.1</td><td>77.7</td><td>128.5</td><td>62.3%</td></tr>
          <tr><td>2024</td><td>Jul</td><td>35.3</td><td>113.0</td><td>93.2</td><td>45.2%</td></tr>
          <tr><td>2024</td><td>Aug</td><td>29.7</td><td>142.7</td><td>63.5</td><td>30.8%</td></tr>
          <tr><td>2024</td><td>Sep</td><td>19.6</td><td>162.3</td><td>43.9</td><td>21.3%</td></tr>
          <tr><td>2024</td><td>Oct</td><td>11.7</td><td>174.1</td><td>32.1</td><td>15.6%</td></tr>
          <tr><td>2024</td><td>Nov</td><td>5.9</td><td>179.9</td><td>26.3</td><td>12.7%</td></tr>
          <tr><td>2024</td><td>Dec</td><td>2.6</td><td>182.5</td><td>23.7</td><td>11.5%</td></tr>
        </tbody>
      </table>
    )
  }
  const table_2023 = () => {
    return (
      <table className="dataframe text-[white]">
  <thead>
    <tr >
      <th>Year</th>
      <th>Month</th>
      <th>ETAW (AF)</th>
      <th>Cumulative ETAW (AF)</th>
      <th>Remaining (AF)</th>
      <th>Remaining (%)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>2023</td><td>Jan</td><td>0.0</td><td>0.0</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Feb</td><td>1.7</td><td>1.7</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Mar</td><td>4.7</td><td>6.4</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Apr</td><td>14.3</td><td>20.7</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>May</td><td>27.3</td><td>48.0</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Jun</td><td>38.7</td><td>86.7</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Jul</td><td>39.7</td><td>126.3</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Aug</td><td>31.6</td><td>157.9</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Sep</td><td>21.0</td><td>179.0</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Oct</td><td>12.2</td><td>191.2</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Nov</td><td>6.7</td><td>197.9</td><td>206.2</td><td>100.0%</td></tr>
    <tr><td>2023</td><td>Dec</td><td>2.6</td><td>200.5</td><td>206.2</td><td>100.0%</td></tr>
  </tbody>
</table>
    )
  }

  const table_2022 = () => {
    return (
      <table className="dataframe text-[white]">
  <thead>
    <tr>
      <th>Year</th>
      <th>Month</th>
      <th>Monthly Value</th>
      <th>Cumulative Value</th>
      <th>Remaining (AF)</th>
      <th>Remaining (%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2022</td>
      <td>Jan</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Feb</td>
      <td>1.3</td>
      <td>1.3</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Mar</td>
      <td>3.9</td>
      <td>5.2</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Apr</td>
      <td>13.1</td>
      <td>18.3</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>May</td>
      <td>23.0</td>
      <td>41.3</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Jun</td>
      <td>29.3</td>
      <td>70.5</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Jul</td>
      <td>34.3</td>
      <td>104.9</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Aug</td>
      <td>26.5</td>
      <td>131.4</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Sep</td>
      <td>16.7</td>
      <td>148.2</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Oct</td>
      <td>11.1</td>
      <td>159.3</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Nov</td>
      <td>5.8</td>
      <td>165.1</td>
      <td>206.2</td><td>100.0%</td>
    </tr>
    <tr>
      <td>2022</td>
      <td>Dec</td>
      <td>2.4</td>
      <td>167.5</td>
      <td>206.2</td><td>100.0%</td>
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
    <div className='p-1 h-full w-full flex gap-2'>
      <div className='flex w-1/3 justify-end flex-col gap-2 text-black dark:text-white '>
        <BasicSelect label='Year' Value={way} showLabel={false} setValue={(value) => setWay(value)} itemList={
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
        <div className='flex flex-grow flex-col gap-1 pl-1 text-white'>
            <div>Parcel ID: XXX-XXX-XXX-XXX</div>
            <div>Account ID: MAD_MA_XXXX</div>
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
      <div className='flex w-2/3 h-full text-white'>
        <RTLineChart way={way}/>
      </div>
    </div>
  );
};

export default TableLineChartInfo;
