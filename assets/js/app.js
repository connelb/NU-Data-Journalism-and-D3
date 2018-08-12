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
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// // Append an SVG group
var chartGroup = svg.append("g")
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

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis,newYScale, chosenYaxis) {

//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cx", d => newXScale(d[chosenXAxis]));

//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cy", d => newYScale(d[chosenYAxis]));

//     return circlesGroup;
// }

function renderXCircles(circlesGroup, newXScale, chosenXaxis) { // 
    console.log(circlesGroup, newXScale, chosenXaxis);
    circlesGroup
        .transition()
        .duration(1000)
        .attr("cx", d => { newXScale(d[chosenXAxis]) });

    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYaxis) { //circlesGroup, 
    console.log('what is circlesGroup?:', circlesGroup, newYScale, chosenYaxis);
    circlesGroup
        .transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    switch (chosenXAxis) {
        case "income":
            var label = "Household Income (Medium):";
            break;
        case "age":
            var label = "Age:";
            break;
        default: //"poverity"
            var label = "Poverty:";
    }

    //   if (chosenXAxis === "income") {
    //     var label = "Household Income (Medium):";
    //   }
    //   else {
    //     var label = "# of Albums:";
    //   }

    //   var toolTip = d3.tip()
    //     .attr("class", "tooltip")
    //     .offset([80, -60])
    //     .html(function(d) {
    //         console.log(d);
    //         return d.age
    //         //return (`${d.age}`);
    //       //return (`${d.age}<br>${label} ${d[chosenXAxis]}`);
    //     });

    //circlesGroup.call(toolTip);

    //   circlesGroup.on("mouseover", function(data) {
    //     //toolTip.show(data);
    //     toolTip.show(data, this)
    //   })
    //     // onmouseout event
    //     .on("mouseout", function(data, index) {
    //       toolTip.hide(data,this);
    //     });

    //   return circlesGroup;
}
//var circlesGroup = chartGroup.selectAll("circle")

// // Retrieve data from the CSV file and execute everything below
d3.csv("./data/data.csv", function (err, chartData) {
    if (err) throw err;

    //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228

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
    // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    //     .domain([0, d3.max(chartData, d => d.smokes)])
    //     .range([height, 0]);

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
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "lightBlue")
        .attr("opacity", ".5");
    // .append("text")
    // .attr("y", d => yLinearScale(d[chosenYAxis]))
    // .attr("x", d => xLinearScale(d[chosenXAxis]))
    // .attr("dy", "1em")
    // .attr("fill", "black")
    // .classed("axis-text", true)
    // .text(d => d['state']);

    console.log('what is circlesGroup', circlesGroup)

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

    // append y axis
    // chartGroup.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("Number of Billboard 500 Hits");

    // updateToolTip function above csv import
    //var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log('chosenXAxis', chosenXAxis, "chosenYAxis", chosenYAxis)

                // var circlesGroup = chartGroup.selectAll("circle")
                // .data(chartData)
                // .enter()
                // .append("circle")
                // .attr("cx", d => xLinearScale(d[chosenXAxis]))
                // .attr("cy", d => yLinearScale(d[chosenYAxis]))
                // .attr("r", 20)
                // .attr("fill", "lightBlue")
                // .attr("opacity", ".5");
                // .attr("cx", d => xLinearScale(d[chosenXAxis]))
                // .attr("cy", d => yLinearScale(d[chosenYAxis]))
                // .attr("r", 20)
                // .attr("fill", "lightBlue")
                // .attr("opacity", ".5");

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(chartData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                console.log('circlesGroup is; ', circlesGroup, 'xLineaScale is ;', xLinearScale, 'xAxis is ', xAxis);

                // updates circles with new x values
                // UPDATE
                chartGroup.selectAll("circle")
                    .transition()
                    .duration(1000)
                    .attr("cx", d => xLinearScale(d[chosenXAxis]))
                    .attr("cy", d => yLinearScale(d[chosenYAxis]))

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // povertyLabel
                // ageLabel
                // incomeLabel
                // smokesLabel
                // obesityLabel

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

                // changes classes to change bold text
                // if (chosenXAxis === "poverty") {
                //     povertyLabel
                //         .classed("active", true)
                //         .classed("inactive", false);
                //     ageLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                //     incomeLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                // }
                // elseIf(chosenXAxis === "poverty") {
                //     albumsLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                //     hairLengthLabel
                //         .classed("active", true)
                //         .classed("inactive", false);
                // }
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

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                // smokesLabel
                // obesityLabel
                // healthcareLabel

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

                // changes classes to change bold text
                // if (chosenYAxis === "num_albums") {
                //     albumsLabel
                //         .classed("active", true)
                //         .classed("inactive", false);
                //     hairLengthLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                // }
                // else {
                //     albumsLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                //     hairLengthLabel
                //         .classed("active", true)
                //         .classed("inactive", false);
                // }
            }
        });
});
