export type TooltipProps = {
  show: boolean
  top?: number
  left?: number
  x?: number
  y?: number
}

/**
 * Renders an absolute-positioned tooltip with `x` and `y` coordinates of the hovered point. Doesn't render anything if any of the params is missing or `show` is `false`.
 */
export const Tooltip = ({ show, top, left, x, y }: TooltipProps) => {
  if (!show || top === undefined || left === undefined || x === undefined || y === undefined) return <></>

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
