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
  };
};

d3.csv("https://raw.githubusercontent.com/bens1858/EDAV-CANCER-PROJECT/refs/heads/main/d3_data2.csv", rowConverter)
  .then(function(data) {
    
    // Set up dimensions
    const w = 750;  // Width of the plot
    const h = 375;  // Height of the plot
    const margin = {top: 40, right: 40, bottom: 60, left: 60};  // Default margin settings
    const innerWidth = w - margin.left - margin.right;
    const innerHeight = h - margin.top - margin.bottom;
    
    // Set up scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.continent).sort())  // Sort continents alphabetically
      .range([0, innerWidth])
      .paddingInner(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, 100])  // Percentage range from 0 to 100
      .range([innerHeight, 0]);

    // Create axes
    const xAxis = d3.axisBottom()
      .scale(xScale);
    
    const yAxis = d3.axisLeft()
      .scale(yScale);

    // Create svg element
    const svg = d3.select("div#plot")
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
      .attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "black");

    svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "black");

    // Add label for y-axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 50)
      .attr("x", (-innerHeight / 2)-20)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "black")
      .text("% of Countries");

    // Add label for x-axis
    svg.append("text")
      .attr("x", w / 2)
      .attr("y", h - margin.bottom + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "black")
      .text("Continent");

    // Create the plot container group
    const plotGroup = svg.append("g")
      .attr("id", "plot")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Select the sliders from the DOM
    const slider1 = document.getElementById("slider1");
    const sliderLabel1 = document.getElementById("sliderLabel1");
    
    const slider2 = document.getElementById("slider2");
    const sliderLabel2 = document.getElementById("sliderLabel2");
    
    const slider3 = document.getElementById("slider3");
    const sliderLabel3 = document.getElementById("sliderLabel3");
    
    const slider4 = document.getElementById("slider4");
    const sliderLabel4 = document.getElementById("sliderLabel4");
    
    const slider5 = document.getElementById("slider5");
    const sliderLabel5 = document.getElementById("sliderLabel5");

    // Function to update the plot based on all five slider values
    function updatePlot() {
      const threshold1 = +slider1.value; // Get the value of the first slider (Cancer Incidence)
      const threshold2 = +slider2.value; // Get the value of the second slider (Cancer Mortality)
      const threshold3 = +slider3.value; // Get the value of the third slider (Physicians per 1k)
      const threshold4 = +slider4.value; // Get the value of the fourth slider (% GDP on Healthcare)
      const threshold5 = +slider5.value; // Get the value of the fifth slider (% Domestic Spending on Healthcare)

      // Update the slider labels
      sliderLabel1.textContent = `Cancer Incidence per 100k >= ${threshold1}`;
      sliderLabel2.textContent = `Cancer Mortality per 100k >= ${threshold2}`;
      sliderLabel3.textContent = `Physicians per 1k >= ${threshold3}`;
      sliderLabel4.textContent = `% GDP on Healthcare >= ${threshold4}`;
      sliderLabel5.textContent = `% Domestic Spending on Healthcare >= ${threshold5}`;

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
          percentage: (v.length / validCountries) * 100,  // Calculate percentage of countries for each continent
          rawCount: v.length  // Store raw count of countries
        };
      }, d => d.continent);

      // Sort the data alphabetically by continent
      continentData.sort((a, b) => d3.ascending(a[0], b[0]));

      // Update the plot bars
      plotGroup.selectAll(".bar")
        .data(continentData)
        .join(
          enter => enter.append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1].percentage))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d[1].percentage))
            .style("fill", "#ff6666"),
          update => update
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1].percentage))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d[1].percentage))
        );

      // Add raw number of countries as labels on the bars
      plotGroup.selectAll(".label")
        .data(continentData)
        .join(
          enter => enter.append("text")
            .attr("class", "label")
            .attr("x", d => xScale(d[0]) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d[1].percentage) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "black")
            .text(d => d[1].rawCount),  // Display raw number of countries
          update => update
            .attr("x", d => xScale(d[0]) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d[1].percentage) - 5)
            .text(d => d[1].rawCount)
        );
    }

    // Add gridlines for y-axis
    const yGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat("");

    svg.append("g")
      .attr("class", "yGrid")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yGrid)
      .style("stroke", "#ccc")
      .style("stroke-width", 0.5);

    // Initialize the plot on load
    updatePlot();

    // Event listeners for each slider
    slider1.addEventListener("input", updatePlot);
    slider2.addEventListener("input", updatePlot);
    slider3.addEventListener("input", updatePlot);
    slider4.addEventListener("input", updatePlot);
    slider5.addEventListener("input", updatePlot);

    // Add annotation for bar labels
    svg.append("text")
      .attr("x", 5)
      .attr("y", 370)
      .style("font-size", "10px")
      .style("font-style", "italic")
      .style("fill", "black")
      .text("*Bar labels represent # of countries");

    // Add additional annotation text with line break
    svg.append("text")
      .attr("x", 512)
      .attr("y", 360)
      .style("font-size", "10px")
      .style("font-style", "italic")
      .style("fill", "black")
      .text("*ChatGPT was utilized in the production of this code")
      .append("tspan")
      .attr("x", 595)
      .attr("dy", "12")  // Create line break
      .text("as allowed by project instructions");
  });