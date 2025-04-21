import React from 'react'
import Spinner from "@/components/Spinner";
import { useSearchParams } from "react-router-dom";
const VerifyUser = () => {
 const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const timestamp = searchParams.get("timestamp");
  const signature = searchParams.get("signature");
  console.log(userId, timestamp, signature);
  return (
    <div className="flex h-screen items-center justify-center dark:bg-slate-900 dark:text-white">
      <div className='flex gap-3 justify-center items-start'>
       <span>Please wait while verifying user </span> <Spinner/> 
  </div>
    </div>
  )
}

export default VerifyUser
