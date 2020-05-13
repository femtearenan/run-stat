import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class Histogram extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
        this.isDrawn = false;

    }

    drawChart() {
        if (this.props.isOK && !this.isDrawn) {
            const data = this.props.data;
            const subDataHeading = this.props.subData;

            const height = 300;
            const width = 400;
            const padding = 40;
            
            const max = d3.max(data, d => d[subDataHeading]);
            const min = d3.min(data, d => d[subDataHeading]);

            const valueInterval = max - min;
            const intervals = this.props.intervals;
            const valueWidth = valueInterval / intervals;

            const barWidth = (width - 2*padding) /intervals;

            const histoArr = histogramize(data, subDataHeading, intervals);

            const svg = d3.select(`#chart-${this.props.id}`)
                .append("svg")
                .attr("id", () => "histo-" + this.props.id)
                .attr("class", () => "histogram")
                .attr("width", width)
                .attr("height", height);

            const yMin = d3.min(histoArr, d => d);
            const yMax = d3.max(histoArr, d => d);

            const xScale = d3.scaleLinear()
                    .domain([min, max])
                    .range([padding, width - padding]);

            const yScale = d3.scaleLinear()
                    .domain([0, yMax + 1])
                    .range([height - padding, padding]);

            let rectId = 0;

            let tooltip = d3.select(".barchart-container").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

            let overlay = d3.select('.visHolder').append('div')
                .attr('class', 'overlay')
                .style('opacity', 0);

            

            svg.selectAll("rect")
                .data(histoArr)
                .enter()
                .append("rect")
                .attr("id", () => "rect-" + rectId++ )
                .attr("x", (d, i) => xScale(min + valueWidth * i))
                .attr("y", (d, i) => height - (height - yScale(d)))
                .attr("width", barWidth)
                .attr("height", (d, i) => height -  yScale(d) - padding)
                .attr("data-value", (d) => min + valueWidth * d)
                .attr("data-height", (d) => d)
                .attr("class", "bar")
                .on("mouseover", (d, i) => {
                    tooltip
                        .style('left', (i * barWidth) + 30 + 'px')
                        .style('top', height - 100 + 'px')
                        .style('opacity', '1')
                        .style('transform', 'translateX(60px)');
                })
                .on("mouseout", () => {
                    tooltip.style('opacity', '0');
                });
                

            svg.selectAll("text.bar-text")
                .data(data)
                .enter()
                .append("text")
                .text((d) =>  (d.name))
                .attr("class", "bar-text")
                .attr("x", (d, i) => i * 75)
                .attr("y", (d) => -10);
            
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

            svg.append("text")             
                .attr("transform",
                      "translate(" + (width/2) + ", " + 
                                     (height-10) + ")")
                .style("text-anchor", "middle")
                .text(this.props.xLabel);
                
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(this.props.yLabel);   


            const infoDiv = d3.select(`#chart-${this.props.id}`)
                .append("div")
                .attr("class", "info");
            
            //Math. round((100 - (price / listprice) * 100) * 100) / 100
            let median = d3.median(data, d => d[subDataHeading]);
            const infoHtml = "<h3>Summary of "+this.props.xLabel+"</h3>"
                + "<div class=\"flex\">"
                + "<p>Min: "+min+"</p>" 
                + "<p>Median: "+ median.toFixed(2) +"</p>"
                + "<p>Max: "+max+"</p>" 
                + "</div>";
            infoDiv.html(infoHtml);

            this.isDrawn = true;
        }

    }

    

    render() {
        if (this.props.isOK) {
            return (
                <div id={"chart-" + this.props.id} className="histo-container" >
                    {this.drawChart()}

                </div>
            )

        } else {
            return (
                <div id={"chart-" + this.props.id} className="histo-container">
                </div>
            );
        }
    }
}

function histogramize(data, subData, intervals) {
    const arr = [...data];
    const resultArr = [0];
    for (let i = 0; i < intervals - 1; i++) {
        resultArr.push(0);
    }
    const min = d3.min(data, d => d[subData]);
    const max = d3.max(data, d => d[subData]);
    const intervalWidth = (max - min) / intervals;
    arr.forEach(d => {
        let index = 0;
        let hasIndex = false;
        while (!hasIndex && index < intervals) {
            if ( (min + intervalWidth * index) <= d[subData] ) {
                if (min + intervalWidth * (index + 1) >= d[subData]) {
                    hasIndex = true;
                } else {
                    index++;
                }
            } else {
                index++;
            }
        }

        let num = 0;
        if (resultArr[index] !== undefined) {
            num = resultArr[index] + 1;
        }
        if (index < resultArr.length) {
            resultArr[index] = num;
        }
    });

    return resultArr;
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(Histogram);