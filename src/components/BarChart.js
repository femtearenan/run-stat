import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
        this.isDrawn = false;
    }

    drawChart() {
        if (this.props.isOK && !this.isDrawn) {
            const height = 300;
            const width = 200;
            const padding = 30;

            const svg = d3.select(`#chart-${this.props.id}`)
                .append("svg")
                .attr("id", () => "barchart-" + this.props.id)
                .attr("class", () => "barchart")
                .attr("width", width)
                .attr("height", height);

            const data = this.props.data;
            const subDataHeading = this.props.subData;
            const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, (d) => {
                        if (subDataHeading.length > 0) {
                            return d[subDataHeading].length;
                        } else {
                            return d.length;
                        }
                    })])
                    .range([padding, height - padding]);

            let rectId = 0;

            //height - yScale(d.runs.length)
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("id", () => "rect-" + rectId++ )
                .attr("x", (d, i) => i * 75)
                .attr("y", (d, i) => 30)
                .attr("width", 50)
                .attr("height", (d, i) => yScale(subDataHeading.length > 0 ? d[subDataHeading].length : d.length));

            svg.selectAll("text.bar-text")
                .data(data)
                .enter()
                .append("text")
                .text((d) =>  (d.name))
                .attr("class", "bar-text")
                .attr("x", (d, i) => i * 75)
                .attr("y", (d) => -10);

            svg.selectAll("text.bar-info")
                .data(data)
                .enter()
                .append("text")
                .text((d) =>  (subDataHeading.length > 0 ? d[subDataHeading].length : d.length))
                .attr("class", "bar-info")
                .attr("x", (d, i) => { 
                    let centering = 20;
                    if (d[subDataHeading].length  < 10) {
                        centering = 20;
                    } else if (d[subDataHeading].length  < 100) {
                        centering = 17;
                    }
                    return i * 75 + centering;
                })
                .attr("y", (d) => -yScale(subDataHeading.length > 0 ? d[subDataHeading].length : d.length)/2);

            this.isDrawn = true;
        }

    }

    // <h2>Number of runs on record</h2>
    

    render() {
        if (this.props.isOK) {
            return (
                <div id={"chart-" + this.props.id} className="barchart-container" >
                    {this.drawChart()}
                </div>
            )

        } else {
            return (
                <div id={"chart-" + this.props.id} className="barchart-container">
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(BarChart);