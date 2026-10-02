# NOTES

- project is using Vite framework
- dev runs on port 5173
- there's just a homepage provided on root, no page routing yet
- todo: create pages and routes for /chart and /settings
- first convert jsx to tsx as I prefer TS
  - created fallback root element to address TS erroring for possible undefined value
- checked docs / asking AI for react-router v8 library api + double checking routing best practices in vite
  - followed instructions for Data Mode
- chart and settings pages created and routed

---

- will need to add a nice layout and navigation, but for now I want to get a basic chart working and define the scope of the settings page
- first: check the GET endpoint to see what data is provided
  - https://brainx.sk/api/chart-data
  - it returns a status string, first thing to check before rendering (will need to handle errors)
  - there are 4 items returned in the items array, each with a name (line number n), color (hexcode), and points array of {x,y} coordinates objects
  - should the lines be rendered in the same chart? what could they represent?
    - maybe add an option to only show desired lines
    - x axis goes from 0 to 100
    - y axis goes from ~200 to ~800
    - but data could change significantly and no constraints are given so I have to make the chart work for various data ranges
- let's start with a simple single line chart
- checking [canvas docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) as I haven't used it in a while
  - googling for canvas line charts examples rather than bare apis, there might be some nice libraries to speed up things and make it look better
  - found Chart.js, but I can't modify dependencies,so that's pointless, checking whether a canvas library is already included
    - it isn't, so I'll stick with native apis (asked AI for a template example without providing context of the challenge)
- actually, first of all I want to validate the endpoint and print the raw data, then use it to populate the canvas
  - could be the use case for the custom hook (useChartData)
  - at some point will need to get settings data so that could be another use case, will need to setup global state for that
- got a CORS error when fetching data, because my app is running on localhost. Asking AI ideas on how to solve. Found out there's a builtin proxy setting in vite. Double checking actual docs, found [server proxy examples](https://vite.dev/config/server-options#server-proxy)
  - didn't fix, I still get an error
- I'm thinking at work we also need a local proxy to avoid this problem, we use Caddy, but I don't think it's worth implementing here. I will look for a simpler solution. Maybe some other settings in Vite?
- turned out I simply didn't notice a typo, I was calling /api/chart-data instead of /api/chart-data/ , the Vite proxy setting is actually working
- the custom hook `useChartData` is still basic (no proper error handling yet) but it fetches data correctly, now I want a basic version of a line graph rendered

---

- rendering the lines is easy, but defaults to an ugly result, thinking how to distribute points along the width of the canvas , then I'll make the canvas responsive
- I need to compute the x and y data ranges once
- now with scaling it looks much better, but still very basic
- I'm thinking, since I can't install new dependencies, to use a CDN instead, like bootstrap or tailwind and chart.js
- implemented chart.js via cdn script and replaced bare canvas with Chart, which renders much more nicely by default and shows data info on hover
  - manually added some typing in chart.d.ts
  - thinking of turning the two useEffects into custom hooks at a later stage (eg useChartJS, useLineChart)
  - the page is still very basic, will make it nicer
  - idea for later: filter lines with a dropdown
- now it's time to setup a basic settings page

---

- settings page needs some modern components from the start,will use bootstrap for simplicity and quick progress
- what settings to include?
  - theme (light/dark)
  - language (english/italian), will need i18 translation strings
  - font size?
- adding some bootstrap components to quickly build a simple UI
  - using bootstrap theme utilities ('data-bs-theme' attribute), it needs a layout wrapper component and a global state
  - creating store folder for all things redux
  - double checking with docs and AI (asking AI to point me to the relevant docs pages) as I don't remember redux syntax, i've been using react context for the last years
  - good opportunity to setup a new custom hook `useTheme`

---

- I run out of time, I need to wrap up with essential UI improvements (layout margins), add some tests and run all checks
  - checking how straightforward is to add a couple of translation strings for a language dropdown setting
  - i'm just using a demo const i18n + redux language state rather than a full implementation with a library
- all checks are now passing. an essential thing todo: implement loading and error boundary for the chart
- while implementing the language selector, i noticed I forgot to use react-router Link components and therefore the global state was resetting (fixed)
- I wanted to store the json raw data in a redux slice and use it to export raw data as a bonus feature, but testing the core features is the priority now to wrap up
- demo tests on: custom hook, static page snapshot, api call
- generated jest config with npm init jest
- can't run tests because I'd need to install a typescript transformer in order for jest to run on .tsx files
  - left some work in progress in `jest` branch with ts-jest installed, but decided it's not worth it now
- adding an alert to handle api errors in chart page

---

- removing Chart.js to use bare Canvas HTML APIs
  - restored previous work
  - noticed that y coordinates are upside down, because canvas origin is top-left rather than bottom-left so I need to compute height in the opposite direction (`height-y`)
  - points are also not well distributed in the canvas, so they need to be normalised and scaled for better rendering
  - referencing https://www.w3schools.com/tags/ref_canvas.asp to apply some nice styling and background grids
  - in order to add data labels on left and bottom, i need to create a margin inside the canvas, at the sides. i've done it manually first, next i'll try using .translate() and .scale() as a more robust solution
    - scale would affect also the line widths, so i'll just use translate
  - using ctx.save() and .restore() to avoid styling code duplication
  - researching how to make the canvas responsive
    - made width and height responsive with some CSS and adaptive resolution to pixel density
    - with more time I would find a way to make it scale when zooming to keep the rendering sharp instead of pixelated
- testing the chart with different data, scaling all coordinates down by 10 -> the labels get rounded wrongly, i need to adapt the rounding based on the data range
  -  using AI to  find an approach: with a logarithm I can find how big/small the data are, then I use the result as a multiplier for the rounding
  - trying with very large and very small data points and data ranges
  - large/small numbers need scientific notation
- to draw the legend i need to keep track of the measure and position of previous items and continue from there with an appropriate spacing
- I removed the custom aspect ratio that adapted to the device aspect ratio (eg. vertical chart on mobile) because i'm not sure it would actually be a desired behaviour in a scientific field
- looking into adding a hover effect to show tooltips with data points coordinates
  - i can get the offsets of the mouse hovering on the chart, with a Set of the points i could quickly check whether the mouse is on a chart point
    - but chart points have different coords from the api so i first need to save them during the drawing
    - found a bug in the normalization function: it was computing the range between min/max points but the axis always start from 0 so the range is actually equal to the max points
  - 
