import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class ScatterPlot extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
    }

    drawChart() {
        if (this.props.isOK) {
            const height = 400;
            const width = 600;
            const padding = 50;

            const svg = d3.select(`#scatter-${this.props.id}`)
                .append("svg")
                .attr("id", () => "scatter-svg-" + this.props.id)
                .attr("class", () => "scatter")
                .attr("width", width)
                .attr("height", height);

            const runData = this.props.runData.map(d => {
                return Object.assign({}, d, {
                    date:  new Date(d.date),
                    time: new Date(d.time.slice(0, 19))
                });
            });
            const typeData = this.props.typeData;

            let dateMin = d3.min(runData, d => d.date);

            if (dateMin.getMonth() === 0) {
                
                if (dateMin.getDate() > 7) {
                    dateMin = new Date(dateMin.getFullYear(), dateMin.getMonth(), dateMin.getDate() - 7);
                } else {
                    dateMin = new Date(dateMin.getFullYear() - 1, 12);
                }
            }


            const xScale = d3.scaleTime()
                .domain([ dateMin, d3.max(runData, d => d.date) ])
                .range([padding, width - padding]);

            
            const yScale = d3.scaleTime()
                    .domain([new Date(1970, 0, 1, 0, 0, 0), d3.max(runData, d => d.time)])
                    .range([height - padding, padding]);

            let rectId = 0;
            svg.selectAll("circle")
                .data(runData)
                .enter()
                .append("circle")
                .attr("id", () => "rect-" + rectId++ )
                .attr("class", d => {
                    if (d.type === "/api/run_types/2") {
                        return "dot orange";
                    } else {
                        return "dot";
                    }
                })
                .attr("r", 5)
                .attr("cx", (d, i) => xScale(d.date))
                .attr("cy", (d, i) => yScale(d.time))
                .attr("width", 50)
                .attr("height", (d, i) => yScale(d.time));
            
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%H:%M:%S"));

            svg.append("g")
                .attr("transform", "translate(0," + (height - padding) + ")")
                .attr("id", "x-axis")
                .call(xAxis);
            svg.append("g")
                .attr("transform", "translate(" + padding+ ", 0)")
                .attr("id", "y-axis")
                .call(yAxis);


            const legend = d3.select(`#scatter-${this.props.id} `)
                .append("svg")
                .attr("class", "scatter-legend")
                .attr("width", 100)
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
        }

    }

    

    render() {
        if (this.props.isOK) {
            return (
                <div id={"scatter-" + this.props.id} className="barchart-container" >
                    <h2>Dates and distances</h2>
                    {this.drawChart()}

                </div>
            )

        } else {
            return (
                <div id={"scatter-" + this.props.id} className="barchart-container">
                    <h2></h2>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(ScatterPlot);