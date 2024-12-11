


// Upload data

const rowConverter = function (d) {
  return {
    continent: d.continent,
    region: d.region,
    Incidence_rate: +d.Incidence_rate,
    Mortality_rate: +d.Mortality_rate,
    avg_phy_rate: +d.avg_phy_rate,
    avg_pct_domestic_spending: +d.avg_pct_domestic_spending,
    avg_pct_gdp: +d.avg_pct_gdp,
    Operational_Policy: d.Operational_Policy
    }
};  

d3.csv("https://raw.githubusercontent.com/bens1858/EDAV-CANCER-PROJECT/refs/heads/main/d3_data2.csv", rowConverter)
  .then(function(data) {
    

// stuff that requires the loaded data
  const w = 1500;
  const h = 500;
  const margin = {top: 25, right: 0, bottom: 25,
      left: 25};
  const innerWidth = w - margin.left - margin.right;
  const innerHeight = h - margin.top - margin.bottom;

  const bardata = [{month: "Jan", value: 10},
                 {month: "Feb", value: 20},
                 {month: "Mar", value: 30},
                 {month: "Apr", value: 40},
                 {month: "May", value: 50},
                 {month: "Jun", value: 90}]

  const xScale = d3.scaleBand()
      .domain(data.map(d => d.region))
      .range([0, innerWidth])
      .paddingInner(.1);

  const yScale = d3.scaleLinear()
      .domain([0, 900])
      .range([innerHeight, 0])

  const xAxis = d3.axisBottom()
      .scale(xScale);

  const yAxis = d3.axisLeft()
      .scale(yScale);



// add svg

  const svg = d3.select("body")
    .append("svg")
      .attr("width", w)
      .attr("height", h);
  

// add background rectangle

  svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "aliceblue");

// add bars as a group

  const bars = svg.append("g")
      .attr("id", "plot")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
    .selectAll("rect")
      .data(data);

  bars.enter().append("rect")
      .attr("x", d => xScale(d.region))
      .attr("y", d => yScale(d.Incidence_rate))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.Incidence_rate))
      .attr("fill", "red");

// add axes

  svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
      .call(yAxis);


  })
  .catch(function(error) {
  
// error handling  

  
  });
  
   var slider = d3.slider().min(0).max(400).ticks(10).showRange(true).value(6);

   d3.select('#slider').call(slider);

