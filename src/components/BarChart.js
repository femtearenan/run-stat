import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
    }

    drawChart() {
        if (this.props.isOK) {
            const height = 300;
            const width = 200;
            const padding = 30;

            const svg = d3.select(`#chart-${this.props.id}`)
                .append("svg")
                .attr("id", () => "barchart-" + this.props.id)
                .attr("class", () => "barchart")
                .attr("width", width)
                .attr("height", height);

            const runData = this.props.runData;
            const typeData = this.props.typeData;

            const normalRun = runData.filter(run => run.type === "/api/run_types/1");
            const intervalRun = runData.filter(run => run.type !== "/api/run_types/1");

            const yScale = d3.scaleLinear()
                    .domain([0, d3.max(typeData, (d) => d.runs.length)])
                    .range([padding, height - padding]);

            let rectId = 0;

            //height - yScale(d.runs.length)
            svg.selectAll("rect")
                .data(typeData)
                .enter()
                .append("rect")
                .attr("id", () => "rect-" + rectId++ )
                .attr("x", (d, i) => i * 75)
                .attr("y", (d, i) => 30)
                .attr("width", 50)
                .attr("height", (d, i) => yScale(d.runs.length));

            svg.selectAll("text.bar-text")
                .data(typeData)
                .enter()
                .append("text")
                .text((d) =>  (d.name))
                .attr("class", "bar-text")
                .attr("x", (d, i) => i * 75)
                .attr("y", (d) => -10);

            svg.selectAll("text.bar-info")
                .data(typeData)
                .enter()
                .append("text")
                .text((d) =>  (d.runs.length))
                .attr("class", "bar-info")
                .attr("x", (d, i) => { 
                    let centering = 20;
                    if (d.runs.length  < 10) {
                        centering = 20;
                    } else if (d.runs.length  < 100) {
                        centering = 17;
                    }
                    return i * 75 + centering;
                })
                .attr("y", (d) => -yScale(d.runs.length)/2);
        }

    }

    

    render() {
        if (this.props.isOK) {
            return (
                <div id={"chart-" + this.props.id} className="barchart-container" >
                    <h2>Number of runs on record</h2>
                    {this.drawChart()}
                    <p>Normal runs are classic distance runs. Interval runs are any of hill runs, fartlek or intervals. <br/>(Source: <a href="https://femtearenan.se">femtearenan.se</a>)</p>

                </div>
            )

        } else {
            return (
                <div id={"chart-" + this.props.id} className="barchart-container">
                    <h2>Loading chart data</h2>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(BarChart);