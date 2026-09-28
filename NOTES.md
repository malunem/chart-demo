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
- 