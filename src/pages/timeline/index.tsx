import WaterAccountingPeriodType from "./WaterAccountingPeriodType"
import WaterAccountingYear from "./WaterAccountingYear"

const Timeline = () => {
  const waterAccoutingRatePeriod = () => {
    return (<WaterAccountingPeriodType/>)
  }
  const waterAccoutingYear = () => {
    return (<WaterAccountingYear/>)
  }
  return (<>
      {waterAccoutingRatePeriod()}
      {waterAccoutingYear()}
    </>
  )
}

export default Timeline
