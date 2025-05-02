import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <PageHeader
        pageHeaderTitle="Clients"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
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
              />
            </div>
          </div>
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            onClick={() => {
              navigate("/clients/clientsForm", {
                state: { mode: "Add" },
              });
            }}
          >
            <Plus size={4} />
            Add Client
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Clients
