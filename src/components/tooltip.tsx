export type TooltipProps = {
  show: boolean
  top?: number
  left?: number
  x?: number
  y?: number
}

export const Tooltip = ({ show, top, left, x, y }: TooltipProps) => {
  if (!show || !top || !left || !x || !y) return <></>

  return (
    <div
      className="tooltip"
      style={{
        position: 'absolute',
        top: top,
        left: left,
        padding: '0.5rem',
        border: '1px solid grey',
        borderRadius: '10%',
        opacity: '80%'
      }}>
      <span>x: {x}</span>
      <br />
      <span>y: {y}</span>
    </div>
  )
}
