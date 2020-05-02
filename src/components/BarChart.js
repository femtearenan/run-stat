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
            const height = 400;
            const width = 200;
            const padding = 30;

            const svg = d3.select(`#chart-${this.props.id}`)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            const runData = this.props.runData;
            const typeData = this.props.typeData;

            const normalRun = runData.filter(run => run.type === "/api/run_types/1");
            const intervalRun = runData.filter(run => run.type !== "/api/run_types/1");

            const yScale = d3.scaleLinear()
                    .domain([0, d3.max(typeData, (d) => d.runs.length)])
                    .range([padding, height - padding]);

            svg.selectAll("rect")
                .data(typeData)
                .enter()
                .append("rect")
                .attr("x", (d, i) => i * 55)
                .attr("y", (d, i) => height - yScale(d.runs.length) )
                .attr("width", 50)
                .attr("height", (d, i) => yScale(d.runs.length));
        }

    }

    render() {
        if (this.props.isOK) {
            return (
                <div id={"chart-" + this.props.id} className="barChart" >
                    <h2>This is a bar chart</h2>
                    <p>Also, everything's OK!</p>
                    {this.drawChart()}
                </div>
            )

        } else {
            return (
                <div id={"chart-" + this.props.id} className="barChart">
                    <h2>This is a bar chart</h2>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(BarChart);