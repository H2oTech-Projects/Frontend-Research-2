import { table } from "console";

export const buildPopupMessage = (properties: any) => {
  if (!properties) return "";
  let tableContent = ""
  Object.keys(properties).forEach((key) => {
    tableContent +=`<tr class="py-10 border-b border-gray-200 hover:bg-gray-100 hover:text-blue-600"><td>${key}:</td><td>${!!properties[key] ? properties[key] : ''}</td></tr>`
  })

  return (
    `<table class="table-fixed md:table-fixed">
      <tbody>
        ${tableContent}
      </tbody>
    </table>`
  )
}
