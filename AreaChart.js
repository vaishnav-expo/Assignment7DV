var margin = {top: 40, right: 20, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var valueline = d3.line()
    .x(function(d) { return x(d["Year"]); })
    .y(function(d) { return y(d["Emissions.Type.CO2"]); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 100)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("emissions.csv").then((data) => {
    data = data.filter(function(d, i){ return d["Country"] === "Afghanistan" })

    data.forEach(function(d) {
        d["Year"] = parseTime(d["Year"]);
        d["Emissions.Type.CO2"] = +d["Emissions.Type.CO2"];
    });
    console.log(data);

    x.domain(d3.extent(data, function(d) { return d["Year"]; }));
    y.domain([0, d3.max(data, function(d) { return d["Emissions.Type.CO2"] })]);

    //Heading
    svg.append("text")
        .attr("x", width/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Area chart for Afghanistan for CO2 emission");

    //x-axis labels
    svg.append("text")
        .attr("x", (width / 2)  )
        .attr("y", height + margin.top )
        .style("text-anchor", "middle")
        .text("Years");

    //y-axis labels
    svg.append("text")
        .attr("x", -(height/2) )
        .attr("y", margin.left - 130)
        .attr("transform","rotate(-90)")
        .style("text-anchor", "middle")
        .text("Total CO2 Emission");

    // Add the area
    svg.append("path")
        .datum(data)
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x(function(d) { return x(d["Year"]) })
            .y0(y(0))
            .y1(function(d) { return y(d["Emissions.Type.CO2"]) })
        )

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
});