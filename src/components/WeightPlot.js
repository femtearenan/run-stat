import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import * as d3r from 'd3-regression';

class ScatterPlot extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
        this.isDrawn = false;
    }

    drawChart() {
        if (this.props.isOK && !this.isDrawn) {
            const height = 300;
            const width = 600;
            const padding = 50;

            const svg = d3.select(`#scatter-${this.props.id}`)
                .append("svg")
                .attr("id", () => "scatter-svg-" + this.props.id)
                .attr("class", () => "scatter")
                .attr("width", width)
                .attr("height", height);

            const runData = this.props.runData;
            const typeData = this.props.typeData;

            let distanceMin = d3.min(runData, d => d.distance);
            let distanceMax = d3.max(runData, d => d.distance);

            let diffMin = d3.min(runData, d => d.weightDiff);
            let diffMax = d3.max(runData, d => d.weightDiff);

            console.log(runData);
            const intervals = runData.filter(d => d.type === "/api/run_types/2");
            const normal = runData.filter(d => d.type === "/api/run_types/1")


            const xScale = d3.scaleLinear()
                .domain([ distanceMin, distanceMax ])
                .range([padding, width - padding]);

            
            const yScale = d3.scaleLinear()
                    .domain([diffMin, diffMax])
                    .range([height - padding, padding]);

            let rectId = 0;
            svg.selectAll("circle")
                .data(runData)
                .enter()
                .append("circle")
                .attr("id", () => "rect-" + rectId++ )
                .attr("class", d => {
                    if (d.type === "/api/run_types/2") {
                        return "anim dot orange";
                    } else {
                        return "anim dot";
                    }
                })
                .attr("r", 5)
                .attr("cx", (d, i) => xScale(d.distance))
                .attr("cy", (d, i) => yScale(d.weightDiff));
                // .attr("width", 50)
                // .attr("height", (d, i) => yScale(d.time));
            
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            svg.append("g")
                .attr("transform", "translate(0," + (height - padding) + ")")
                .attr("id", "x-axis")
                .call(xAxis);
            svg.append("g")
                .attr("transform", "translate(" + padding+ ", 0)")
                .attr("id", "y-axis")
                .call(yAxis);
            
            let linearFunc = d3r.regressionLinear()
                .x(d => d.distance)
                .y(d => d.weightDiff);

            let linear = linearFunc(runData);
            svg.append("line")
                .attr("x1", xScale(linear[0][0]))
                .attr("y1", yScale(linear[0][1]))
                .attr("x2", xScale(linear[1][0]))
                .attr("y2", yScale(linear[1][1]))
                .attr("stroke-width", 2)
                .attr("stroke", "#4964ff");


            const legend = d3.select(`#scatter-${this.props.id} `)
                .append("svg")
                .attr("id", `#scatter-legend-${this.props.id} `)
                .attr("class", "scatter-legend")
                .attr("width", 120)
                .attr("height", 100);

            legend.selectAll("circle")
                .data(typeData)
                .enter()
                .append("circle")
                .attr("r", 8)
                .attr("cx", 10)
                .attr("cy", (d, i) => 8 + i * 20)
                .attr("class", d => {
                    if (d.name === "intervals") {
                        return "dot orange";
                    } else {
                        return "dot";
                    }
                });
            legend.selectAll("text")
                .data(typeData)
                .enter()
                .append("text")
                .attr("class", "legend-text")
                .text(d => d.name)
                .attr("x", 20)
                .attr("y", (d, i) => 12 + i * 20);
            
            const funcString = "y=" + linear.a.toFixed(2) + "+" + linear.b.toFixed(2) +"x";
            const rSquared = "R\u00B2=" + linear.rSquared.toFixed(2);

            legend.append("rect")
                .attr("x", 6)
                .attr("y", 45)
                .attr("width", 8)
                .attr("height", 3)
                .attr("fill", "#4964ff");
            legend.append("text")
                .attr("class", "legend-text")
                .text(funcString)
                .attr("x", 20)
                .attr("y", 50);
            legend.append("text")
                .attr("class", "legend-text")
                .text(rSquared)
                .attr("x", 20)
                .attr("y", 70);  

            this.isDrawn = true;
        }

    }

    

    render() {
        if (this.props.isOK) {
            return (
                <div id={"scatter-" + this.props.id} className="barchart-container" >
                    {this.drawChart()}
                </div>
            )

        } else {
            return (
                <div id={"scatter-" + this.props.id} className="barchart-container">
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(ScatterPlot);