import React from 'react';
import { connect } from 'react-redux';
import { requestData, views, changeView } from './redux/actions'
import './static/css/style.min.css';
// import { render } from '@testing-library/react';
import BarChart from './components/BarChart';
import ScatterPlot from './components/ScatterPlot';
import HeatMap from './components/HeatMap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.views = views;
    this.switchView = this.switchView.bind(this);
  }
  
  switchView(event) {
    let idName = event.target.id;
    let btnIndex = idName.indexOf("Btn");
    let view = idName.substr(0, btnIndex);
    console.log(view);

    if (view !== undefined) {
      this.props.switchView(view);
    }

}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Runner statistics</h1>
          <p>Profile: Anders Björkland</p>
          <nav >
            <button id={this.views[0] + "Btn"} onClick={this.switchView} className={this.props.currentView.basic === "display" ? "active" : ""}>Basic data</button>
            <button id={this.views[1] + "Btn"} onClick={this.switchView} className={this.props.currentView.analyses === "display" ? "active" : ""}>Analyses</button>
            <button id={this.views[2] + "Btn"} onClick={this.switchView} className={this.props.currentView.meta === "display" ? "active" : ""}>Meta data</button>
          </nav>
        </header>
        <div id="view">
            <div className={this.props.currentView.basic}>
                <BarChart id="basic"/>
            </div>
            <div className={this.props.currentView.analyses}>
                <ScatterPlot id="analyses" />
            </div>
            <div className={this.props.currentView.meta}>
                <HeatMap id="meta" />
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
  requestData: () => dispatch(requestData()),
  switchView: (view) => dispatch(changeView(view))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
