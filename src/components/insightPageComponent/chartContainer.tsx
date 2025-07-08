import { AllocationChartDataType } from '@/types/apiResponseType'
import React from 'react'
import StackedBarChart from '../charts/stackedBarChart'
import Spinner from '../Spinner'

const ChartContainer = ({ loading, data, setSelectedFarm, parcelLoading }: { loading: boolean, data: AllocationChartDataType[], setSelectedFarm: Function, parcelLoading: Boolean }) => {
  if (loading)
    return (
      <div
        className={"dark:bg-slate-500 rounded-[8px] pb-[25px] my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)]"}
        style={{ height: 150 }}
      >
        <div className="flex justify-center items-center h-full gap-2"> Chart is Loading <Spinner/> </div>
      </div>
    )
  const ChartBars = () => data?.length > 0 ?
    <StackedBarChart
      data={data}
      config={{ margin: { top: 20, right: 30, left: 40, bottom: 5 } }}
      layout={'vertical'}
      stack1={'remaining'}
      stack2={'allocation_used'}
      setSelectedFarm={!parcelLoading ? setSelectedFarm : (farmUnit: string)=> {}}
    /> : <div className="flex justify-center items-center h-full">No Chart Available</div>
  return <div
    className={"dark:bg-slate-500 rounded-[8px] pb-[25px] my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)]"}
    style={{ height: 70 * (data?.length || 1)  + 80 }}
  >
    <ChartBars />
  </div>
}

export default React.memo(ChartContainer)
