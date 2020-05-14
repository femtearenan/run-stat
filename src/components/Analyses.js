import React from 'react';
import { connect } from 'react-redux';
import HeatMap from './HeatMap';
import ScatterPlot from './ScatterPlot';
import WeightPlot from './WeightPlot';
import {setStatistic, STATISTIC_CHOICES} from '../redux/actions'
import * as d3 from 'd3';

class Analyses extends React.Component {
    constructor(props) {
        super(props);
        this.setStatistic = this.setStatistic.bind(this);
    }

    // state = {
    //     currentView: STATISTIC_CHOICES[0]
    // }

    setStatistic(event) {
        if(STATISTIC_CHOICES.includes(event.currentTarget.id)) {
            this.props.setStatistic(event.currentTarget.id);
  
            const rSquared = "R\u00B2=" + this.props.statistic[event.currentTarget.id].rSquared.toFixed(2);
            const regressionFunction = "y=" + this.props.statistic[event.currentTarget.id].b.toFixed(2) + "+" + this.props.statistic[event.currentTarget.id].a.toFixed(2) +"x";
            if (event.currentTarget.id === "normal") {
                d3.select("#line-0").attr("class", "hide");
                d3.select("#line-1").attr("class", "show");
                d3.select("#line-2").attr("class", "hide");
            } else if (event.currentTarget.id === "intervals") {
                d3.select("#line-0").attr("class", "hide");
                d3.select("#line-1").attr("class", "hide");
                d3.select("#line-2").attr("class", "show");
            }  else {
                d3.select("#line-0").attr("class", "show");
                d3.select("#line-1").attr("class", "hide");
                d3.select("#line-2").attr("class", "hide");
            } 
            d3.select("#regression-function").text(regressionFunction);
            d3.select("#r-squared").text(rSquared);
        }
    }

    render() {
        // Regression
        // Heat map
        return (
            <div id={this.props.id} className="view">
                <h2 className="none">Analyses</h2>
                <div className="stats-container">
                    <div className="flex-1">
                        <ScatterPlot id="1" />
                        <div className="info">
                            <h3>Run durations</h3>
                            <p className="description">The evolutions of my runs compared by typed of run.</p>
                        </div>
                    </div>
                    <div className="flex-2">
                        <HeatMap id="2" />
                        <div className="info">
                            <h3>Weekday runs</h3>
                            <p className="description">The time I've spent on running per weekday.</p>
                        </div>
                    </div>
                    <div className="flex-3">
                        <WeightPlot id="3" />
                        <div className="info">
                            <h3>Distance (km) vs Weight Difference (kg)</h3>
                            <div className="flex">
                                <button id={STATISTIC_CHOICES[0]} className="active" onClick={this.setStatistic}>
                                    {STATISTIC_CHOICES[0].charAt(0).toUpperCase() + STATISTIC_CHOICES[0].slice(1)}
                                </button>
                                <button id={STATISTIC_CHOICES[1]} className="" onClick={this.setStatistic}>
                                    {STATISTIC_CHOICES[1].charAt(0).toUpperCase() + STATISTIC_CHOICES[1].slice(1)}
                                </button>
                                <button id={STATISTIC_CHOICES[2]} className="" onClick={this.setStatistic}>
                                    {STATISTIC_CHOICES[2].charAt(0).toUpperCase() + STATISTIC_CHOICES[2].slice(1)}
                                </button>

                            </div>
                            <p className="description">Correlates distance with how much the weight differs. The difference is mainly due to water loss - through sweating and breathing. However, what causes one to loose more water?</p>
                            <p className="description">In this plot the weight difference is only correlated with run distance. As is shown from the R{"\u00B2"}-value, the linear model explains about {this.props.isOK ? (this.props.activeStatistic.data.rSquared * 100).toFixed(0) : "TBD" }% of the variation in the data. </p>
                            <p className="description">The model however states that there is a positive correlation between the distance and how much the weight differs. For every kilometer 
                            the weight difference is increased by {this.props.isOK ? this.props.activeStatistic.data.a.toFixed(2) : "TBD"} kg. Put in imperial units: {this.props.isOK ? (this.props.activeStatistic.data.a*1.37).toFixed(2) : "TBD"} lbs/mile.</p>
                            <p className="description">As you can see, having shoes and a variable can take you places. But there are more to be known about the weight difference with more variables. 
                            The distance by itself tells a part of the story. Other things that could matter is <em>weather</em>, <em>clothing</em>, <em>terrain</em>, <em>pre-weight</em> and <em>hydration/food</em>. With this avenues for potential further research I conclude the analysis.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    setStatistic: (type) => dispatch(setStatistic(type))
});
export default connect(mapStateToProps, mapDispatchToProps)(Analyses)