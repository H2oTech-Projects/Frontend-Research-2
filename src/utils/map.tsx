import { table } from "console";

export const buildPopupMessage = (properties: any) => {
  if (!properties) return "";
  let tableContent = ""
  let rows = Object.keys(properties).map((key) =>
    <tr className="py-10 border-b border-gray-200 hover:bg-gray-100 hover:text-blue-600"><td className="px-2">{key}:</td><td>{!!properties[key] ? properties[key] : ''}</td></tr>
  )
  // return (
  //   `<table class="table-fixed md:table-fixed">
  //     <tbody>
  //       ${tableContent}
  //     </tbody>
  //   </table>`
  // )
  return (
    <table className="table-fixed md:table-fixed">
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}
