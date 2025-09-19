import { initialTableDataTypes } from "@/types/tableTypes";
import { useCallback, useState } from "react";
import { debounce } from '@/utils';

export const useTableData = ({initialTableData}:{initialTableData:initialTableDataTypes}) => {
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const [searchText, setSearchText] = useState<string >('');
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );
  const handleSearch = (text:string) =>{
    debouncedSearch(text);
    setSearchText(text);
    };
  const handleClearSearch = () =>{
    setSearchText(""); 
    setTableInfo({ ...tableInfo, search: "" })
  };

  return {tableInfo,setTableInfo,searchText,handleSearch,handleClearSearch}
}