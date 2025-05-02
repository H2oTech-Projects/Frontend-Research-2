import CollapseBtn from '@/components/CollapseBtn';
import LeafletMap from '@/components/LeafletMap';
import PageHeader from '@/components/PageHeader'
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { ChevronsLeft, ChevronsRight, Plus, Search } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Canals = () => {
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState("default");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };
  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <PageHeader
        pageHeaderTitle="Canals"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
      <div className="pageContain flex flex-grow flex-col gap-3">
        <div className="flex justify-between">
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
              //     setSearchText(e.target.value);
              //     debouncedSearch(e.target.value);}}
              />
            </div>
            {/* {tableInfo.search &&  <Button
                            variant={"default"}
                            className="h-7 w-7"
                            onClick={() => {setSearchText(""); setTableInfo({...tableInfo,search:""})}}
                        >
                         <X />
                        </Button>} */}
          </div>
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            onClick={() => {
              navigate("/canals/canalsForm", {
                state: { mode: "Add" },
              });
            }}
          >
            <Plus size={4} />
            Add Canal
          </Button>
        </div>
        <div className="flex flex-grow">
          <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
            <div className={cn("relative h-[calc(100vh-160px)] w-full")}>
              table
              <CollapseBtn
                className="absolute -right-1 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
                onClick={mapCollapseBtn}
                note={collapse === 'default' ? 'View Full Table' : "Show Map"}
              >
                <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </div>
          </div>

          <div className={cn("w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3")}>
            <div
              className={cn("relative flex h-[calc(100vh-160px)] w-full")}
              id="map"
            >
              <LeafletMap
                position={position}
                zoom={zoomLevel}
                collapse={collapse}

                configurations={{ 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } }}
              >
                <div className="absolute top-1/2 left-1/2 right-1/2 z-[800] flex gap-4 -ml-[70px] ">
                  <div className="flex  rounded-lg bg-[#16599a] text-slate-50 bg-opacity-65 p-2 text-xl h-auto gap-3 ">Loading <Spinner /></div>
                </div>
              </LeafletMap>
              <CollapseBtn
                className="absolute -left-4 top-1/2 z-[11000] m-2 flex size-8 items-center justify-center"
                onClick={tableCollapseBtn}
                note={collapse === 'default' ? 'View Full Map' : "Show Table"}
              >
                <ChevronsLeft className={cn(collapse === "table" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Canals
