import React from 'react';
import { connect } from 'react-redux';
import D3HeatMap from '../tools/D3HeatMap';

class HeatMap extends React.Component {
    constructor(props) {
        super(props);
        this.width = this.props.width;
        this.height = this.props.height;
        this.padding = this.props.padding;
        this.drawHeatMap = this.drawHeatMap.bind(this);
    }

    drawHeatMap() {
        if (this.props.isOK) {
            const data = [...this.props.runData];
            let heatData = data.map(d => {
                
                d.date = new Date(d.date);
                d.time = new Date(d.time);
                d.day = d.date.getDay();
                d.month = d.date.getMonth();
                return {
                    day: d.day,
                    month: d.month,
                    duration: 0,
                    time: d.time,
                };
            });


            let heatMonths = [];
            let heatMonth = false;
            for (let month = 0; month < 12; month++) {
                for (let weekday = 0; weekday < 7; weekday++) {
                    heatMonth = heatData.filter(element => element.day === weekday && element.month === month);
                    if (heatMonth.length > 0) {
                        heatMonths.push(heatMonth);
                    }
                    
                }
            }

            let heatDataProcessed = [];
            for (let i = 0; i < heatMonths.length; i++) {
                let processedObject = false;
                for (let j = 0; j < heatMonths[i].length; j++) {
                    if (j === 0) {

                        processedObject = {...heatMonths[i][j]};
                    }
                    processedObject.duration = addRunTimesInSeconds(processedObject.duration, heatMonths[i][j].time)
                }
                if (processedObject !== false) {
                    heatDataProcessed.push(processedObject);
                }
            }
            
            
            const heatMap = new D3HeatMap(heatDataProcessed, "#heatmap", {x: "month", y:"day", heat: "duration"});
            heatMap.attachHeatMap();
        }
    }

    

    render() {
        if (this.props.isOK) {
            return (
                <div id="heatmap">
                    { this.drawHeatMap() }
                </div>
            );
        } else {
            return (
                <div id="heatmap">
                    <p id="description">Loading heat map</p>
                </div>

            );
        }
    }
}

function addRunTimesInSeconds(seconds, date) {
    return seconds + date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(HeatMap);