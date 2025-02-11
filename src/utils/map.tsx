export const buildPopupMessage = (properties: any) => {
  if (!properties) return "";
  const tableContent = Object.keys(properties).map((key) => {return(`<tr class="py-10 border-b border-gray-200 hover:bg-gray-100"><td>${key}</td><td>:${!!properties[key] ? properties[key] : ""}</td></tr>`)})
  return (
    `<table class="table-fixed md:table-fixed">
      <tbody>
        ${tableContent}
      </tbody>
    </table>`
  )
}
