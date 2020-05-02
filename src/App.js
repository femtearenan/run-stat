import React from 'react';
import { connect } from 'react-redux';
import { requestData } from './redux/actions'
import './App.css';
import { render } from '@testing-library/react';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Runner statistics</h1>
          <p>Profile: Anders Björkland</p>
        </header>
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
