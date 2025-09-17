import React, { ReactNode } from 'react';
import {  staticPermissionList } from "@/utils/testPermission";
import { useSelector } from 'react-redux';

type PermissionCheckWrapperProps = {
  name: string;              
  children: ReactNode;
};

const PermissionCheckWrapper: React.FC<PermissionCheckWrapperProps> = ({
  name,
  children,
}) => {
const UserRole = useSelector((state: any) => state.auth?.userRole);
const permissionList =  staticPermissionList(UserRole);
 
 if (!permissionList?.includes(name)) {
    return null; 
  }

  return <>{children}</>;
};

export default PermissionCheckWrapper;