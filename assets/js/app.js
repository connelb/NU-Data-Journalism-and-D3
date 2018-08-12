// d3.select(window).on("resize", handleResize);

// // When the browser loads, loadChart() is called
// loadChart();

// function handleResize() {
//     var svgArea = d3.select("#chart");

//     // If there is already an svg container on the page, remove it and reload the chart
//     if (!svgArea.empty()) {
//         svgArea.remove();
//         loadChart();
//     }
// }

// function loadChart() {
    // var svgWidth = parseInt(d3.select('#chart').style('width'), 10);
    // var svgHeight = parseInt(d3.select('#chart').style("height"),10);
    // console.log('s',svgWidth,svgHeight)
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // // Create an SVG wrapper, append an SVG group that will hold our chart,
    // // and shift the latter by left and top margins.
    var svg = d3
        .select("#chart")
        //.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // // Append an SVG group
    var chartGroup = svg.append("g")
        .classed('chartGroup', true)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // // Initial Params
    var chosenXAxis = "income";
    var chosenYAxis = "smokes";

    // // function used for updating x-scale var upon click on axis label
    function xScale(chartData, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(chartData, d => d[chosenXAxis]) * 0.8,
            d3.max(chartData, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, width]);

        return xLinearScale;
    }

    // function used for updating y-scale var upon click on axis label
    function yScale(chartData, chosenYAxis) {
        // Create y scale
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d[chosenYAxis])])
            .range([height, 0]);

        return yLinearScale;
    }

    // // function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    // function used for updating yAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // function used for updating circles group with new tooltip
    function updateXToolTip(chosenXAxis, circlesGroup) {

        switch (chosenXAxis) {
            case "income":
                var label = "Household Income (Medium):";
                var value = 'income';
                break;
            case "age":
                var label = "Age:";
                var value = 'age';
                break;
            default: //"poverity"
                var label = "Poverty:";
                var value = 'poverty';
        }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([0, -margin.top * 2])
            .html(function (d) {
                return (`${d.state}<br>${label} ${d[value]}`);
            });

        var circlesGroup = chartGroup.selectAll("circle");

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
            //toolTip.show(data);
            toolTip.show(data, this)
        })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data, this);
            });

        return circlesGroup;
    }

    function updateToolTip(chosenYAxis, chosenYAxis) {

        switch (chosenXAxis) {
            case "income":
                var label = "Household Income (Medium):";
                var value = 'income';
                break;
            case "age":
                var label = "Age:";
                var value = 'age';
                break;
            default: //"poverity"
                var label = "Poverty:";
                var value = 'poverty';
        }

        switch (chosenYAxis) {
            case "smokes":
                var ylabel = "% Smokes:";
                var yvalue = 'smokes';
                break;
            case "obesity":
                var ylabel = "Obesity Rate:";
                var yvalue = 'obesity';
                break;
            default: //"poverity"
                var ylabel = "Healthcare coverage:";
                var yvalue = 'healthcare';
        }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([0, -margin.top * 2])
            .html(function (d) {
                return (`${d.state}<br>${ylabel} ${d[yvalue]}<br>${label} ${d[value]}`);
            });

        var circlesGroup = chartGroup.selectAll("circle")

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
            //toolTip.show(data);
            toolTip.show(data, this)
        })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data, this);
            });

        return circlesGroup;
    }

    // // Retrieve data from the CSV file and execute everything below
    d3.csv("./data/data.csv", function (err, chartData) {
        if (err) throw err;

        // parse data
        chartData.forEach(function (data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;

            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
            data.healthcare = +data.healthcare;
        });

        // xLinearScale function above csv import
        var xLinearScale = xScale(chartData, chosenXAxis);
        var yLinearScale = yScale(chartData, chosenYAxis);

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        //JOIN
        var circlesGroup = chartGroup.selectAll("circle")
            .data(chartData);


        //ENTER
        circlesGroup
            .enter()
            .append('g').attr('class', 'circle')
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 20)
            .attr("fill", "lightBlue")
            .attr("opacity", ".5");

        var text = chartGroup.selectAll("text")
            .data(chartData)
            .enter()
            .append("g")
            .classed("circleText", true)
            .append("text");

        var textLabels = text
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .attr("dy", ".30em")
            .attr("dx", "-.10em")
            .text(function (d) { return d.abbr; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle") 
            .attr("fill", "white");

        // Create group for  3 x- axis labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        // Create group for  3 y- axis labels
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("transform", `translate(0, ${margin.top + height / 2})`);

        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("Poverty");

        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age");

        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Medium Income");

        var smokesLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -20)
            .attr("value", "smokes") // value to grab for event listener
            .classed("active", true)
            .text("Smokes (%)");

        var obesityLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -40)
            .attr("value", "obesity") // value to grab for event listener
            .classed("inactive", true)
            .text("Obesity (%)");

        var healthcareLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -60)
            .attr("value", "healthcare") // value to grab for event listener
            .classed("inactive", true)
            .text("Healthcare Coverage (%)");

        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis);

        // x axis labels event listener
        xLabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    // replaces chosenXAxis with value
                    chosenXAxis = value;

                    // functions here found above csv import
                    // updates x scale for new data
                    xLinearScale = xScale(chartData, chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderXAxes(xLinearScale, xAxis);

                    // updates circles with new x values
                    // UPDATE
                    chartGroup.selectAll("circle")
                        .transition()
                        .duration(1000)
                        .attr("cx", d => xLinearScale(d[chosenXAxis]))
                        .attr("cy", d => yLinearScale(d[chosenYAxis]))

                    //UPDATE
                    text
                        .transition()
                        .duration(1000)
                        .attr("x", d => xLinearScale(d[chosenXAxis]))
                        .attr("y", d => yLinearScale(d[chosenYAxis]))

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis);

                    switch (chosenXAxis) {
                        case "poverty":
                            povertyLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            break;
                        case "age":
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            ageLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            break;
                        default:
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            incomeLabel
                                .classed("active", true)
                                .classed("inactive", false);
                    }
                }
            });


        // x axis labels event listener
        yLabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {

                    // replaces chosenYAxis with value
                    chosenYAxis = value;

                    // functions here found above csv import
                    // updates x scale for new data
                    yLinearScale = yScale(chartData, chosenYAxis);

                    // updates x axis with transition
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // updates circles with new y values
                    //UPDATE
                    chartGroup.selectAll("circle")
                        .transition()
                        .duration(1000)
                        //.attr("r", 10)
                        .attr("cx", d => xLinearScale(d[chosenXAxis]))
                        .attr("cy", d => yLinearScale(d[chosenYAxis]))

                    //UPDATE
                    text
                        .transition()
                        .duration(1000)
                        .attr("x", d => xLinearScale(d[chosenXAxis]))
                        .attr("y", d => yLinearScale(d[chosenYAxis]))

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis);

                    switch (chosenYAxis) {
                        case "smokes":
                            smokesLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            break;
                        case "obesity":
                            smokesLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            obesityLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            break;
                        default:
                            smokesLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            healthcareLabel
                                .classed("active", true)
                                .classed("inactive", false);
                    }
                }
            });
    });
// }
