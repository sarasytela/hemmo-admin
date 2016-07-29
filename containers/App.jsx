import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MenuDrawer from '../components/MenuDrawer';
import Header from '../components/Header';

import * as UiActions from '../actions/ui';

class App extends Component {
  render() {
    const { drawerOpened, view, actions } = this.props;

    return(
      <MuiThemeProvider>
        <div>
          <MenuDrawer
            open={drawerOpened}
            closeDrawer={actions.closeDrawer}
            changeView={actions.changeView}
            activeView={view}
          />
          <Header
            toggleDrawer={actions.toggleDrawer}
            activeView={view}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  view: PropTypes.string.isRequired,
  drawerOpened: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    view: state.ui.view,
    drawerOpened: state.ui.drawerOpened
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UiActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
