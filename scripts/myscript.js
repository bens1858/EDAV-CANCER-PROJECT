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
    
    // Set up dimensions
    const w = 700;
    const h = 375;  // Reduced height for the graph
    const margin = {top: 40, right: 0, bottom: 50, left: 50};  // Further reduced bottom margin
    const innerWidth = w - margin.left - margin.right;
    const innerHeight = h - margin.top - margin.bottom;
    
    // Set up scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.continent))
      .range([0, innerWidth])
      .paddingInner(0.1);
    
    const yScale = d3.scaleLinear()
      .domain([0, 100])  // Percentage from 0 to 100
      .range([innerHeight, 0]);

    // Create axes
    const xAxis = d3.axisBottom()
      .scale(xScale);
    
    const yAxis = d3.axisLeft()
      .scale(yScale);

    // Create svg element
    const svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Add background rectangle
    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "aliceblue");

    // Add title
    svg.append("text")
      .attr("x", w / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Exploring Cancer and Healthcare Patterns in Countries by Continent");

    // Add axes to svg
    svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)  // Adjusted bottom margin
      .call(xAxis);
    
    svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
      .call(yAxis);

    // Add label for y-axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 40)
      .attr("x", -innerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("% of Countries");

    // Add label for x-axis (Continent)
    svg.append("text")
      .attr("x", w / 2)
      .attr("y", h - margin.bottom + 35)  // Adjusted for placement below the x-axis
      .attr("text-anchor", "middle")
      .text("Continent");

    // Create the plot container group
    const plotGroup = svg.append("g")
      .attr("id", "plot")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create the slider container (move underneath the graph and align left)
    const sliderContainer = d3.select("body").append("div")
      .style("width", `${innerWidth}px`)
      .style("margin", "0")
      .style("text-align", "left")  // Align sliders to the left
      .style("margin-top", "20px");  // Space between graph and sliders

    // First slider (Cancer Incidence per 100k)
    const slider1 = sliderContainer.append("input")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", 840)
      .attr("step", 1)
      .attr("value", 0)
      .style("width", "100%");  // Make the slider as wide as the graph

    // First slider label
    const sliderLabel1 = sliderContainer.append("p")
      .text(`Cancer Incidence per 100k >= ${slider1.node().value}`);

    // Second slider (Cancer Mortality per 100k)
    const slider2 = sliderContainer.append("input")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", 342)
      .attr("step", 1)
      .attr("value", 0)
      .style("width", "100%");  // Make the slider as wide as the graph

    // Second slider label
    const sliderLabel2 = sliderContainer.append("p")
      .text(`Cancer Mortality per 100k >= ${slider2.node().value}`);

    // Third slider (Physicians per 1k)
    const slider3 = sliderContainer.append("input")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", 8.2)
      .attr("step", 0.01)
      .attr("value", 0)
      .style("width", "100%");  // Make the slider as wide as the graph

    // Third slider label
    const sliderLabel3 = sliderContainer.append("p")
      .text(`Physicians per 1k >= ${slider3.node().value}`);

    // Fourth slider (% GDP on Healthcare)
    const slider4 = sliderContainer.append("input")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", 18.6)
      .attr("step", 0.1)
      .attr("value", 0)
      .style("width", "100%");  // Make the slider as wide as the graph

    // Fourth slider label
    const sliderLabel4 = sliderContainer.append("p")
      .text(`% GDP on Healthcare >= ${slider4.node().value}`);

    // Fifth slider (% Domestic Spending on Healthcare)
    const slider5 = sliderContainer.append("input")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", 27)
      .attr("step", 0.1)
      .attr("value", 0)
      .style("width", "100%");  // Make the slider as wide as the graph

    // Fifth slider label
    const sliderLabel5 = sliderContainer.append("p")
      .text(`% Domestic Spending on Healthcare >= ${slider5.node().value}`);

    // Function to update the plot based on all five slider values
    function updatePlot() {
      const threshold1 = +slider1.node().value; // Get the value of the first slider (Cancer Incidence)
      const threshold2 = +slider2.node().value; // Get the value of the second slider (Cancer Mortality)
      const threshold3 = +slider3.node().value; // Get the value of the third slider (Physicians per 1k)
      const threshold4 = +slider4.node().value; // Get the value of the fourth slider (% GDP on Healthcare)
      const threshold5 = +slider5.node().value; // Get the value of the fifth slider (% Domestic Spending on Healthcare)

      // Update the slider labels
      sliderLabel1.text(`Cancer Incidence per 100k >= ${threshold1}`);
      sliderLabel2.text(`Cancer Mortality per 100k >= ${threshold2}`);
      sliderLabel3.text(`Physicians per 1k >= ${threshold3}`);
      sliderLabel4.text(`% GDP on Healthcare >= ${threshold4}`);
      sliderLabel5.text(`% Domestic Spending on Healthcare >= ${threshold5}`);

      // Filter data based on all five slider values and exclude any row with NA or invalid data
      const filteredData = data.filter(d => {
        return d.Incidence_rate >= threshold1 && 
               d.Mortality_rate >= threshold2 &&
               d.avg_phy_rate >= threshold3 &&
               d.avg_pct_gdp >= threshold4 &&
               d.avg_pct_domestic_spending >= threshold5 &&
               !isNaN(d.Incidence_rate) && 
               !isNaN(d.Mortality_rate) && 
               !isNaN(d.avg_phy_rate) && 
               !isNaN(d.avg_pct_gdp) &&
               !isNaN(d.avg_pct_domestic_spending) &&
               d.continent !== '' && d.region !== '';  // Ensure other fields aren't empty or invalid
      });

      // Group data by continent and calculate the percentage of countries that meet the threshold
      const continentData = d3.rollups(filteredData, v => {
        // Exclude countries with invalid data in the total countries count
        const validCountries = data.filter(d => 
          d.continent === v[0].continent && 
          !isNaN(d.Incidence_rate) && 
          !isNaN(d.Mortality_rate) && 
          !isNaN(d.avg_phy_rate) && 
          !isNaN(d.avg_pct_gdp) && 
          !isNaN(d.avg_pct_domestic_spending)
        ).length;

        return {
          percentage: (v.length / validCountries) * 100,  // Calculate percentage
          rawCount: v.length  // Raw count of valid countries
        };
      }, d => d.continent);

      // Join the filtered data to the bars and update
      const bars = plotGroup.selectAll("rect")
        .data(continentData, d => d[0]);

      // Add new bars for newly added continents or thresholds
      bars.enter().append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1].percentage))  // Height based on percentage
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d[1].percentage))
        .attr("fill", "lightcoral");

      // Update existing bars (transition to new heights)
      bars.transition()
        .duration(500)
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1].percentage))  // Height based on percentage
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d[1].percentage));

      // Remove any bars that no longer have data
      bars.exit().remove();

      // Add or update labels for the bars to show the raw count
      const labels = plotGroup.selectAll("text")
        .data(continentData, d => d[0]);

      // Add new labels
      labels.enter().append("text")
        .attr("x", d => xScale(d[0]) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d[1].percentage) - 5)  // Position text just above the bar
        .attr("text-anchor", "middle")
        .text(d => d[1].rawCount);  // Show the raw number on the bar

      // Update existing labels
      labels.transition()
        .duration(500)
        .attr("x", d => xScale(d[0]) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d[1].percentage) - 5)
        .text(d => d[1].rawCount);  // Show the raw number on the bar

      // Remove labels that no longer have data
      labels.exit().remove();

      // Add annotation text at the bottom left corner
      svg.append("text")
        .attr("x", 0)  // Adjusted for the left margin
        .attr("y", 370)  // Adjusted to move it up slightly from the bottom
        .attr("text-anchor", "start")  // Align text to the left
        .style("font-size", "10px")  // Smaller font size
        .style("font-style", "italic")
        .text("*Bar labels represent # of countries");
    }

    // Listen for changes to any slider and update the plot
    slider1.on("input", updatePlot);
    slider2.on("input", updatePlot);
    slider3.on("input", updatePlot);
    slider4.on("input", updatePlot);
    slider5.on("input", updatePlot);

    // Initial plot update
    updatePlot();
  })
  .catch(function(error) {
    console.error("Error loading data:", error);
  });
