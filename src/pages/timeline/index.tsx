import React from 'react'
import { cn } from "@/utils/cn";

import WaterAccountingPeriodType from "./WaterAccountingPeriodType"

const Timeline = () => {

  const waterAccoutingRatePeriod = () => {
    return (<WaterAccountingPeriodType/>)
  }
  const waterAccoutingYear = () => {
    return (<></>)
  }
  return (<>{waterAccoutingRatePeriod()}</>)
}

export default Timeline
