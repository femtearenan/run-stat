import React from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import Histogram from './Histogram';

class Meta extends React.Component {

    render() {

        return (
            <div id={this.props.id} className="view">
                <h2 className="none">Meta information</h2>
                <div className="stats-container">
                    <div>
                        <h3>The data behind Runner Statistics</h3>
                        <p className="description">The data that is used on this site is fetched from <a href="https://femtearenan.se/api">femtearenan.se/api</a>. 
                        This means that the runs are based on one person's runs: mine - Anders Björkland. It also means that the data is only from 
                         runs where I have measured my weight before and after a run.</p>
                        <p className="description">The weight data is measured with a cheap bathroom scale.</p>
                        <p className="description">The distance is measured with a Suunto Ambit3 Run and its inbuilt GPS.</p>
                        <p className="description">The API does not contain heart rate or cadence at this moment.</p>
                    </div>
                    <div>
                        <h3>About me</h3>
                        <p className="description">I am an enthusiastic runer and coder - hence this site.</p>
                        <p className="description">If you want to follow my endeavours - check me out on <a href="https://twitter.com/abjorkland">Twitter</a> or my <a href="https://femtearenan.se">personal website</a>.</p>
                        <p className="description"></p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
})
export default connect(mapStateToProps)(Meta)