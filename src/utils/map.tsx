export const buildPopupMessage = (properties: any) => {
  if (!properties) return "";
  console.log(Object.keys(properties))
  const tableContent = Object.keys(properties).map((key) => {return(`<tr><td>${key}</td><td>:${!!properties[key] ? properties[key] : ""}</td></tr>`)})
  return (
    `<table>
      <tbody>
        ${tableContent}
      </tbody>
    </table>`
  )
}
