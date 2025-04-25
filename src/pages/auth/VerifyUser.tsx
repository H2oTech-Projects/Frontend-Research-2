import React, { useEffect } from 'react'
import Spinner from "@/components/Spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePostCheckToken } from '@/services/registration';
import { toast } from 'react-toastify';

const VerifyUser = () => {
  const { mutate, isPending, isError, error, isSuccess, data } = usePostCheckToken();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const timestamp = searchParams.get("timestamp");
  const signature = searchParams.get("signature");

  useEffect(() => {
    if (userId && timestamp && signature) {
      mutate({ user_id: userId, timestamp, signature });
    } else {
      toast.error("Invalid verification link. Please try again.");
      navigate("/page-not-found")
    }

  }, [userId, timestamp, signature]);

  useEffect(() => {
    if (data) {
      if (isSuccess) {
        navigate("/auth/login");
        toast.success("User verified successfully! Please login to your account.");

      } else {
        navigate("/auth/register");
        toast.error("User verification failed. Please try again.");
      }
    }
  }, [data])

    useEffect(() => {
      if (error) {
        navigate("/auth/register");
        toast.error("User verification failed. Please try again.");
      }
    }, [isError])

    return (
      <div className="flex h-screen items-center justify-center dark:bg-slate-900 dark:text-white">
        <div className='flex gap-3 justify-center items-start'>
          <span>Please wait while verifying user </span> <Spinner />
        </div>
      </div>
    )
  }

  export default VerifyUser
