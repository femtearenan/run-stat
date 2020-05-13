import React from 'react';
import { connect } from 'react-redux';
import HeatMap from './HeatMap';
import ScatterPlot from './ScatterPlot';

class Analyses extends React.Component {

    render() {
        // Regression
        // Heat map
        console.log(this.props.runData);
        return (
            <div id={this.props.id} className="view">
                <h2 className="none">Analyses</h2>
                <div className="stats-container">
                    <div>
                        <ScatterPlot id="1" />
                        <div className="info">
                            <h3>Run durations</h3>
                            <p className="description">The evolutions of my runs compared by typed of run.</p>
                        </div>
                    </div>
                    <div>
                        <HeatMap id="1" />
                        <div className="info">
                            <h3>Weekday runs</h3>
                            <p className="description">The time I've spent on running per weekday.</p>
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