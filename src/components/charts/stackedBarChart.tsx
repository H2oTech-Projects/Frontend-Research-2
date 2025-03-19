import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend,Line, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";

interface ChartParameters {
  layout: string;
  data: any;
  config: any;
  stack1: string;
  stack2: string;
  setSelectedFarm: Function;
}

const StackedBarChart = ({data, config, stack1, stack2, setSelectedFarm}: ChartParameters) => {
  const remainings = data?.map((d: any) => d.remaining);
  const allocation_useds = data?.map((d: any) => d.allocation_used);

  const min = Math?.min(Math.min(...remainings), Math.min(...allocation_useds))
  const max = Math?.max(Math.max(...remainings), Math.max(...allocation_useds))
  let minTick = Math.round(min / 20) * 20 ;
  minTick = minTick >= 0 ? -20 : minTick;
  let maxTick = Math.round(max / 20) * 20;
  maxTick = maxTick > 100 ? maxTick : 120;

  const generateTicks = (min: number, max: number, step: number) => {
    let ticks = [];
    for (let i = min; i <= max; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const dataItem = data.find((d: any) => d.category === payload.value);
    return (
      <g transform={`translate(${x},${y})`} style={{ cursor: "pointer" }}>
        <text x={-10} y={0} dy={4} textAnchor="end" className="dark:fill-white">
          {payload.value.length > 5 ? payload.value.slice(0, 5) + "..." : payload.value}
          <title className="text-white">{dataItem.full_label}</title>
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "white",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px"
        }}>
          <span>{`${payload[0].payload.full_label}`}</span>
            {
              payload.map((subBar: any,index:number) => {
                const num = subBar.dataKey == 'remaining' ? subBar.payload.fu_remain_af : subBar.payload.fu_etaw_af
                return ( <p key={index} style={{color: subBar.color}}>{`${subBar.name}: ${subBar.value}% (${num} AF)`}</p> )
              })
            }
        </div>
      )
    }
    return <></>;;
  };

  const barClick = (e: any) => {
     setSelectedFarm(e.full_label)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout={'vertical'}
        data={data}
        margin={config.margin}
        stackOffset="sign"
        barCategoryGap="10%"  // ✅ Decreases gap between grouped bars
        // barSize={'30'}
        //barGap={-10}
        >
        <Tooltip content={<CustomTooltip />} /> {/* ✅ Custom Tooltip */}
        <XAxis type="number" tickCount={10} stroke="black" ticks={generateTicks(minTick, maxTick, 20)} tick={props => (
    <text
      x={props.x}
      y={props.y}
      dy={10}
      textAnchor="middle"
      className=" font-semibold text-[14px] dark:fill-white" // Tailwind classes
    >
      {props.payload.value}
    </text>
  )}/>
        <YAxis
          dataKey="category"
          type="category"
          stroke="black"
          tick={<CustomYAxisTick />}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey={stack2} stackId="a" fill="#d8b365" name="Allocation Used" onClick={barClick}/>
        <Bar dataKey={stack1} stackId="a" fill="#5ab4ac" name="Remaining" onClick={barClick}/>
        <ReferenceLine x={0} stroke="#c94c4c" strokeWidth={3} strokeDasharray="3 3" label={{ value: "0%", position: "left", style: { fill: "#16599a", fontSize: 15, fontWeight: "bold" } }}/>
        <ReferenceLine x={100} stroke="#c94c4c"  strokeWidth={3} strokeDasharray="3 3" label={{ value: "100%", position: "right", style: { fill: "red", fontSize: 15, fontWeight: "bold" } }}/>
        {/* <ReferenceArea x1={0} x2={10} fill="lightblue" fillOpacity={0.3}/> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
