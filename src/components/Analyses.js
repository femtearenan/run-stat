import React from 'react';
import { connect } from 'react-redux';
import HeatMap from './HeatMap';
import ScatterPlot from './ScatterPlot';
import WeightPlot from './WeightPlot';

class Analyses extends React.Component {

    render() {
        // Regression
        // Heat map
        console.log(this.props.runData);
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
                            <h3>Distance vs Weight Difference</h3>
                            <p className="description">Correlates distance with how much the weight differs. The difference is mainly due to water loss - through sweating and breathing.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
})
export default connect(mapStateToProps)(Analyses)