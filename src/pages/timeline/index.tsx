import React from 'react'
import { cn } from "@/utils/cn";

import WaterAccountingRatePeriod from "./WaterAccountingRatePeriod"
import WaterAccountingYear from "./WaterAccountingYear"

const Timeline = () => {

  const waterAccoutingRatePeriod = () => {
    return (<WaterAccountingRatePeriod/>)
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
