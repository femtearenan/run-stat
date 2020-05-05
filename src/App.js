import React from 'react';
import { connect } from 'react-redux';
import { requestData } from './redux/actions'
import './static/css/style.min.css';
// import { render } from '@testing-library/react';

import BarChart from './components/BarChart';
import ScatterPlot from './components/ScatterPlot';

class App extends React.Component {

  detectElement() {
    console.log("DETECTED");
  }

  render() {
    return (
      <div className="App" onScroll={this.detectElement}>
        <header className="App-header">
          <h1>Runner statistics</h1>
          <p>Profile: Anders Björkland</p>
        </header>
        <article>
          <BarChart id="1"/>
          <ScatterPlot id="1"/>
        </article>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  requestData: () => dispatch(requestData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
