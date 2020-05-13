import React from 'react';
import { connect } from 'react-redux';
import { requestData, views, changeView } from './redux/actions'
import './static/css/style.min.css';
// import { render } from '@testing-library/react';
import Basic from './components/Basic';
import Analyses from './components/Analyses';
import Meta from './components/Meta';

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
          <nav>
            <button id={this.views[0] + "Btn"} onClick={this.switchView} className={this.props.currentView.basic === "display" ? "active" : ""}>Basic data</button>
            <button id={this.views[1] + "Btn"} onClick={this.switchView} className={this.props.currentView.analyses === "display" ? "active" : ""}>Analyses</button>
            <button id={this.views[2] + "Btn"} onClick={this.switchView} className={this.props.currentView.meta === "display" ? "active" : ""}>Meta info</button>
          </nav>
        </header>
        <div id="view" className={this.props.isOK ? "" : "none"}>
            <div className={this.props.currentView.basic}>
                <Basic id="basic"/>
            </div>
            <div className={this.props.currentView.analyses}>
                <Analyses id="analyses" />
            </div>
            <div className={this.props.currentView.meta}>
                <Meta id="meta" />
            </div>   
        </div>
        <div className={this.props.isOK ? "none" : ""}>
            <div>
              <h3>Loading runner data</h3>
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
