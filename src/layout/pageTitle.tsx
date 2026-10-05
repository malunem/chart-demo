/**
 * Renders simple `h1` title in a div with a bottom border
 */
export const PageTitle = ({ title }: { title: string }) => {
  return (
    <div className="border-bottom">
      <h1>{title}</h1>
    </div>
  )
}
