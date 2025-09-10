import { useState } from "react";


const AllFieldList = ({ fields }: any)=>{
  const [search, setSearch] = useState("");
  const filteredFields = fields?.fieldPctFarmed?.filter((item: string) =>
    item.toLowerCase().includes(search.toLowerCase())
  );
  const shouldShowFiltered = search.trim() !== "";
  const title = shouldShowFiltered ? "Search Results" : "All Fields";
  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Search Field..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[300px] px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-royalBlue text-black"
      />
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="flex flex-col gap-2 text-sm max-h-[300px] overflow-y-auto w-[300px]">
        {shouldShowFiltered ? (
          filteredFields?.length > 0 ? (
            filteredFields.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between border-b border-slate-300 pb-1"
              >
                <div> {item}</div>              
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic text-center py-4">
              No results found
            </div>
          )
        ) : (
          fields?.fieldPctFarmed?.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between border-b border-slate-300 pb-1"
            >
              <div> {item}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default  AllFieldList;