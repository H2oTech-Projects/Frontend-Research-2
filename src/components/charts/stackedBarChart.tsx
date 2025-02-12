import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend,Line, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";

interface ChartParameters {
  layout: string;
  data: any;
  config: any;
  stack1: string;
  stack2: string;
}

const StackedBarChart = ({data, config, stack1, stack2}: ChartParameters) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout={'vertical'}
        data={data}
        margin={config.margin}
        stackOffset="sign"
      >
        <XAxis type="number" tickCount={10} />
        <YAxis dataKey="category" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey={stack1} stackId="a" fill="#80cdc1" name="Remaining %"/>
        <Bar dataKey={stack2} stackId="a" fill="#16599a" name="Allocation Used %"/>
        <ReferenceLine x={0} stroke="red" strokeDasharray="3 3" label={{ value: "0%", position: "insideLeft", style: { fill: "#16599a", fontSize: 10, fontWeight: "bold" } }}/>
        <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" label={{ value: "100%", position: "left", style: { fill: "red", fontSize: 10, fontWeight: "bold" } }}/>
        {/* <ReferenceArea x1={0} x2={10} fill="lightblue" fillOpacity={0.3}/> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
