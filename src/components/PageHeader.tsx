import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

interface PathType {
    menuName: string;
    menuPath: string;
}

type PageHeaderProps = {
    breadcrumbPathList: PathType[];
    pageHeaderTitle: string;
    pageHeaderAction?: any 
};

const PageHeader = ({ breadcrumbPathList, pageHeaderTitle,pageHeaderAction }: PageHeaderProps) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-1">
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbPathList?.map((breadcrumbPath) => {
                        return (
                            <Fragment key={breadcrumbPath?.menuName}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink className="hover:cursor-pointer" onClick={()=>{navigate(breadcrumbPath?.menuPath)}}>{breadcrumbPath?.menuName}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                            </Fragment>
                        );
                    })}

                    <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">{pageHeaderTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex justify-between ">
            <div className="text-xl font-medium text-royalBlue dark:text-white capitalize">{pageHeaderTitle}</div>
            {pageHeaderAction && pageHeaderAction}
</div>
        </div>
    );
};

export default PageHeader;
