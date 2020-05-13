import React from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import Histogram from './Histogram';

class Basic extends React.Component {

    render() {
        // Type of runs: bar chart
        // Distances: histogram
        // Wight differences: histogram
        return (
            <div id={this.props.id} className="view">
                <h2 className="none">Basic data</h2>
                <div className="stats-container">
                    <div>
                        <BarChart id="types" data={this.props.typeData} subData="runs"/>
                        <h3>Number of runs per category</h3>
                        <p className="description">Normal runs are classic distance runs. Interval runs are any of hill runs, fartlek or intervals. <br/>(Source: <a href="https://femtearenan.se">femtearenan.se</a>)</p>
                    </div>
                    <div>
                        <Histogram id="distances" data={this.props.runData} subData="distance" intervals="8" xLabel="Distance (km)" yLabel="Count"/>
                    </div>
                    <div>
                        <Histogram id="weight-diff" data={this.props.runData} subData="weightDiff" intervals="8" xLabel="Weight Difference (kg)" yLabel="Count"/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
})
export default connect(mapStateToProps)(Basic)