/// <reference types="vite-plugin-svgr/client" />
import { useState, useEffect} from "react";
import $ from 'jquery';
import React from "react";
import { Input } from "../../../../components/ui/input";
import { PrimaryButton } from "../../../../components/ui/button";
import  SearchIcon  from "../../../../assets/icons/search-icon.svg?react";
import  FilterIcon  from "../../../../assets/icons/filter-icon.svg?react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Map from "../../../../components/map";
import TanSackTable from "../../../../components/data-table";

let mableState = 0;
// if mableState = 0 , map and table both occupy 50% width
// if mableState = 1 , table occupies full width
// if mableState = 2 , map occupies full width
const Field = () => {
  const [searchValue, setSearchValue] = useState("");
  const [resizeMap, setResizeMap] = useState(false);
  useEffect(() => {
    // $("#mapSection").hide()
    // $("#tableSection").animate({ width: '100%' }, 'slow');
    //$("#mapSection").animate({ width: '100%' }, 'slow');
}, []);
  const currentUlr = () => {
    return (
      <div className="flex">
        <div className="w-25 leading-6 text-[#CEC5C5]">
          <span>Management</span><span className="pl-3 float-right">/</span>
        </div>
        <div className="flex-initial w-20 ml-3 leading-6">
          Field
        </div>
      </div>
    )
  }

  const title = () => {
    return (
      <div className="mt-3 text-[#94A3B8]">Field</div>
    )
  }

  const resizeMable = () => {
    $("#mapSection").width('1%');
    $("#mapSection").show()
    $("#tableSection").animate({ width: '50%' }, 'slow');
    $("#mapSection").animate({ width: '50%' }, 'slow');
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.trim() === "") {
      setSearchValue("");
    }
    setSearchValue(value);
  };

  const searchAddController = () => {
    return (
      <div className="flex justify-between">
        <div className="flex mt-2 space-x-[50px]">
          <div className="flex-initial relative mb-2 flex w-full max-w-[300px]">
            <Input
              placeholder="Search by name"
              value={searchValue}
              onChange={handleInputChange}
              startIcon={<SearchIcon fill="#015294" />}
              //icon={(searchValue || searchQuery) && <CloseIcon />}
              // onChangeIcon={() => {
              //   setSearchValue("");
              //   setShowSuggestions(false);
              //   updateSearchQuery("");
              // }}
              //onKeyDown={inputSubmit}
              //onFocus={() => setIsInputFocused(true)}
              className="mt-0 w-[300px] rounded-lg border-neutral-unum-300 bg-white pl-10 text-neutral-unum-800 shadow-sm"
            />
          </div>
          <div className="w-25 mt-3">
            <FilterIcon/>
          </div>
        </div>
        <div className="flex mt-2 ">
          <PrimaryButton
              text="Add Field"
              type="button"
              className="h-[42px] w-[118px] rounded-lg px-4 text-base font-semibold bg-[#94A3B8]"
              onclick={resizeMable}
            />
          </div>
      </div>
    )
  }

  const showTable = () => {
    if (mableState == 0){
      $("#tableSection").animate({ width: '100%' }, 'slow');
      $("#mapSection").animate({ width: '0%' }, 'slow').promise()
      .then(function() {
        mableState = 1;
        $("#mapSection").hide()
        //setResizeMap(!resizeMap)
      });;

    }
    else if (mableState == 1 || mableState == 2) {
      $("#tableSection").show()
      $("#mapSection").animate({ width: '50%' }, 'slow');
      $("#tableSection").animate({ width: '50%' }, 'slow').promise().then(function () {
        mableState = 0;
        setResizeMap(!resizeMap)
      });
    }
  }

  const showMap = () => {
    if (mableState == 0){
      $("#mapSection").animate({ width: '100%' }, 'slow');
      $("#tableSection").animate({ width: '0%' }, 'slow').promise()
      .then(function() {
        $("#tableSection").hide()
        setResizeMap(!resizeMap)
      });;
      mableState = 2;
    }
    else if (mableState == 2 || mableState == 1){
      $("#mapSection").show()
      $("#mapSection").animate({ width: '50%' }, 'slow');
      $("#tableSection").animate({ width: '50%' }, 'slow').promise()
      .then(function() {
        mableState = 0;
        setResizeMap(!resizeMap)
      });;;

    }

  }
  const mable = () => {
    return (
      <div className="flex h-[652px] w-[1141] gap-4 p-2">
        <div className="w-1/4" id="tableSection">
          <div className="h-[652px] overflow-y-auto">
            <TanSackTable/>
          </div>
          <button className="rounded-full relative float-right bg-[#ffdf00] z-[880] top-[-302px]" onClick={showMap}>
            <ChevronsLeft size={30} />
          </button>
        </div>

        <div className="w-1/2 bg-[green] mrl-[20px]" id="mapSection">
          <div className="h-[652px] overflow-y-auto">
            <Map resize={resizeMap}/>
          </div>
          <button className="rounded-full relative float-left top-[-46.5%] bg-[#ffdf00] z-[880]" onClick={showTable}>
              <ChevronsRight size={30} />
          </button>
          </div>
      </div>
    )
  }
  return (
    <>
    {currentUlr()}
    {title()}
    {searchAddController()}
    {mable()}
    </>
  )
};

export default Field;
