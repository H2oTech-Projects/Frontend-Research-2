import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

interface PathType {
  menuName: string;
  menuPath: string;
  stateData?: string;
}

type PageHeaderProps = {
  breadcrumbPathList: PathType[];
  pageHeaderTitle: string;
};

const PageHeader = ({ breadcrumbPathList, pageHeaderTitle }: PageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-1">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbPathList?.map((breadcrumbPath) => {
            return (
              <Fragment key={breadcrumbPath?.menuName}>
                <BreadcrumbItem>
                  <BreadcrumbLink className="hover:cursor-pointer" onClick={() => {
                    navigate(breadcrumbPath?.menuPath, {
                      state: breadcrumbPath?.stateData ? breadcrumbPath?.stateData : undefined
                    })
                  }}>{breadcrumbPath?.menuName}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              </Fragment>
            );
          })}

          <BreadcrumbItem>
            <BreadcrumbPage>{pageHeaderTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-xl font-medium text-royalBlue dark:text-white">{pageHeaderTitle}</div>
    </div>
  );
};

export default PageHeader;
