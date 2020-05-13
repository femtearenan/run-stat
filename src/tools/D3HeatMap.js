import * as d3 from 'd3';

class D3HeatMap {
    constructor(data, selection = "#heatmap", heatAttribute = {x: "year", y: "month", heat: "variance"}, dimension = { height: 300, width: 600, padding: { x: 60, y: 40} }) {
        this.data = data;
        this.selection = selection;
        this.heatAttribute = heatAttribute;
        this.dimension = dimension;
        this.cell = {
            width: (dimension.width - dimension.padding.x * 2) / (5),
            height: (dimension.height - (dimension.padding.y)) / (7)
        };
        this.attachHeatMap = this.attachHeatMap.bind(this);
        this.colors = ["#808080", "#666666", "#4d4d4d", "#343434", "#1a1a1a"];
    }

    attachHeatMap(xFormat = (month) => {
        switch (month) {
            case 0: return "January";
            case 1: return "February";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "August";
            case 8: return "September";
            case 9: return "October";
            case 10: return "November";
            case 11: return "December";
            default: return "";
        }
    }, yFormat = (day) => { 
            switch (day) {
                case 0: return "Monday";
                case 1: return "Tuesday";
                case 2: return "Wednesday";
                case 3: return "Thursday";
                case 4: return "Friday";
                case 5: return "Saturday";
                case 6: return "Sunday";
                default: return "";
            }
        }
        ){
        const xScale = this.getXScale(this.data, this.heatAttribute.x);
        const yScale = this.getYScale(this.data, this.heatAttribute.y);

        const xAxis = d3.axisBottom(xScale);
        if (typeof xFormat === "function") {
            xAxis.tickFormat(d => xFormat(d));
        } else if (xFormat) {
            xAxis.tickFormat(d3.format("d"))
        } else {
            console.log("xFormat is false")
        }

        const yAxis = d3.axisLeft(yScale);
        if (typeof yFormat === "function") {
            yAxis.tickFormat(d => yFormat(d)).ticks(7);
        } else if (yFormat) {
            yAxis.tickFormat(d3.format(yFormat))
        }

        const svg = d3.select(this.selection)
                        .append("svg")
                        .attr("class", "map-content")
                        .attr("width", this.dimension.width)
                        .attr("height", this.dimension.height);
        const minHeat = d3.min(this.data, d => d[this.heatAttribute.heat]);
        const maxHeat = d3.max(this.data, d => d[this.heatAttribute.heat]);
        const heatInterval = (maxHeat - minHeat) / this.colors.length;

        this.attachLegend();
        const info = d3.select(this.selection)
                        .append("div")
                        .attr("id", "tooltip")
                        .attr("class", "hide");
                        
        
        svg.selectAll('rect')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('x', (d, i) => {
                return this.dimension.padding.x + d[this.heatAttribute.x] * this.cell.width}
            )
            .attr('y', (d, i) => this.dimension.padding.y/2 + d[this.heatAttribute.y] * this.cell.height)
            .attr('height', this.cell.height)
            .attr('width', this.cell.width)
            .attr('class', d => {
                let order = Math.floor(d[this.heatAttribute.heat] / heatInterval);
                return 'order' + order; 
            })
            .attr('data-' + this.heatAttribute.x, d => d[this.heatAttribute.x])
            .attr('data-' + this.heatAttribute.y, d => d[this.heatAttribute.y]-1)
            .attr('data-temp', d => d[this.heatAttribute.heat])
            .attr('fill', d => getColorForScale(d[this.heatAttribute.heat], [minHeat, maxHeat]))
            .on('mouseover', d => {
                let time = new Date(+d[this.heatAttribute.heat]*1000);

                info.attr("class", "show")
                    .text(`${this.heatAttribute.heat}: ${ getTimeString(time) }`)
                    .attr('data-year', d[this.heatAttribute.x])
            })
            .on('mouseout', d => info.attr("class", "hide"));

        svg.append('g')
            .attr('transform', 'translate(' + (this.dimension.padding.x + 10) + ',' + (this.dimension.height - this.dimension.padding.y /2) + ')')
            .attr('id', 'x-axis')
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + this.dimension.padding.x + ", " + (this.dimension.padding.y/4) + ')')
            .attr("id", "y-axis")
            .call(yAxis);
    }

    attachLegend() {
        let width = 300;
        let height = 100;
        let rectWidth = (width - 20) / this.colors.length
        let rectHeight = height / 2;
        const legend = d3.select("#heatmap")
                            .append("svg")
                            .attr("id", "legend")
                            .attr("class", "heat-legend")
                            .attr("width", width)
                            .attr("height", height);
        

        legend.selectAll('rect')
            .data(this.colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => rectWidth*(i) === 0 ? 10 : rectWidth * i)
            .attr('y', 10)
            .attr('height', rectHeight)
            .attr('width', rectWidth)
            .attr('fill', (d) => d);
        
        const minHeat = d3.min(this.data, d => d[this.heatAttribute.heat]);
        const maxHeat = d3.max(this.data, d => d[this.heatAttribute.heat]);
        let heatDomain = [];
        let heatRange = [];
        let heatInterval = (maxHeat - minHeat) / this.colors.length;
        for (let i = 0; i < this.colors.length; i++) {
            heatDomain.push(minHeat + heatInterval*i);
            heatRange.push(rectWidth*(i) === 0 ? 10 : rectWidth*(i));
        }
        const heatScale = d3.scaleOrdinal()
            .domain([ ...heatDomain, maxHeat ])
            .range([...heatRange, width-20 ]);
        const heatAxis = d3.axisBottom(heatScale);
        heatAxis.tickFormat(d => getShortTimeString(new Date(d*1000)));
        heatAxis.ticks(7);


        legend.append('g')
            .attr('transform', 'translate(0,' + (height - (height / 3)) + ')')
            .attr('id', 'heat-axis')
            .call(heatAxis);
        
        
    }

    getXScale() {
        let xMax = d3.max(this.data, d => d[this.heatAttribute.x]);
        let xOrder = [];
        let xRange = [];
        for (let i = 0; i <= xMax; i++) {
            xOrder.push(i);
            xRange.push(this.dimension.padding.x + this.cell.width * i);
        }
        return d3.scaleOrdinal()
            .domain([-1, ...xOrder ])
            .range([
                -10,
                ...xRange,
                this.dimension.width - this.dimension.padding.x - this.cell.width / 2]);
    }

    getYScale() {
        return d3.scaleOrdinal()
            .domain([-1, 0, 1, 2, 3, 4, 5, 6])
            .range([
                this.dimension.padding.y/4,
                this.dimension.padding.y, 
                this.dimension.padding.y + this.cell.height,
                this.dimension.padding.y + this.cell.height*2,
                this.dimension.padding.y + this.cell.height*3,
                this.dimension.padding.y + this.cell.height*4,
                this.dimension.padding.y + this.cell.height*5,
                this.dimension.padding.y + this.cell.height*6,
                this.dimension.height - this.dimension.padding.y*0.75]);
    }
}
function getColorForScale(value, range = [-5, 5], colors = 
    ["#808080", "#666666", "#4d4d4d", "#343434", "#1a1a1a"]) {
    const rangeLength = range[1] - range[0];
    const intervals = rangeLength / colors.length;
    
    let i = getIndex(value, range[0], intervals, 0, colors.length);
    return colors[i];
}

function getIndex(value, minValue, intervals, index, maxDepth) {
    if (value <= minValue + intervals * (index + 1)) {
        return index;
    } else if (index === maxDepth) {
        return maxDepth - 1;
    } else {
        return getIndex(value, minValue, intervals, ++index, maxDepth);
    }
}

function getTimeString(time) {
    return `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes() }:${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()}`;
}

function getShortTimeString(time) {
    return `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes() }`;
}

export default D3HeatMap;