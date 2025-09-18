import { useState } from "react";
import { toast } from 'react-toastify';

export const showErrorToast = (messages: any) => {
  let contents: any = [];
  Object.keys(messages).forEach(key => {
    messages[key].forEach((message: string) => {
      contents.push(<ul key={key} className="list-disc marker:text-sky-400"><li ><b>{key}</b>: {message}</li></ul>);
    });
  });

  toast.error(
    <div>
      {contents}
    </div>
  );
};

export const showSuccessToast = (messages: any) => {
  toast.success(
    <div>
      {messages}
    </div>
  );
};

export const AgroItems = ({ data,name }: {data:string[],name:string})=>{
  const [search, setSearch] = useState("");
  const filteredFields = data?.filter((item: string) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const displayFields = () => {
    const shouldShowFiltered = search.trim() !== "";
    if (!shouldShowFiltered) return showAllFields()
    if (filteredFields?.length < 1) return (<div className="text-gray-500 italic text-center py-4">No results found</div>)
    return filteredFields.map((item: any, index: number) => (
        <div
          key={index}
          className="flex justify-between border-b border-slate-300 pb-1"
        >
          <div> {item}</div>
        </div>
    ))
  }

  const showAllFields = () => {
    return (
      data?.map((item: any, index: number) => (
        <div
          key={index}
          className="flex justify-between border-b border-slate-300 pb-1"
        >
          <div> {item}</div>
        </div>
      ))
    )
  }

  const shouldShowFiltered = search.trim() !== "";
  const title = shouldShowFiltered ? "Search Results" : `All ${name}`;

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder={`Search ${name}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[300px] px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-royalBlue text-black"
      />
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="flex flex-col gap-2 text-sm max-h-[300px] overflow-y-auto w-[300px]">
        {displayFields()}
      </div>
    </div>
  );
}
