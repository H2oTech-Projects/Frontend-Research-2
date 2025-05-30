import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const index = () => {
   const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <PageHeader
        pageHeaderTitle="User Roles"
        breadcrumbPathList={[{ menuName: "Configuration", menuPath: "" }]}
      />
       <div className="pageContain flex flex-grow flex-col gap-3">
            <div className="flex justify-between ">
                    <div className="flex gap-2">
                      <div className="input h-7 w-52">
                        <Search
                          size={16}
                          className="text-slate-300"
                        />
                        <input
                          name="search"
                          id="search"
                          placeholder="Search..."
                          // value={searchText}
                          className="w-full bg-transparent text-sm text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                          // onChange={(e) => {
                          //   setSearchText(e.target.value);
                          //   debouncedSearch(e.target.value);
                          // }}
                        />
                      </div>
                      {/* {tableInfo.search && <Button
                        variant={"default"}
                        className="h-7 w-7"
                        onClick={() => { setSearchText(""); setTableInfo({ ...tableInfo, search: "" }) }}
                      >
                        <X />
                      </Button>} */}
                    </div>
                    <Button
                      variant={"default"}
                      className="h-7 w-auto px-2 text-sm"
                      onClick={() => {
                        navigate("/userRoles/addUserRole")
                      }}
                    >
                      <Plus size={4} />
                      Add User roles
                    </Button>
                  </div>

</div>
    </div>
  )
}

export default index
