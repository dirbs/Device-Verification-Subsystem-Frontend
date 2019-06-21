import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import i18n from "./i18n";
import Full from "./containers/Full/Full";

class Loader extends Component {
  state = {
    bool: false
  };
  componentDidMount() {
    this.timer()
  }
  timer = () => {
    setTimeout(() => this.setState({bool:true}), 2000);
  };
  render() {
    if (this.state.bool === true) {
      return (
        <HashRouter>
          <Switch>
            <Route path="/" name="Home" component={Full} />
          </Switch>
        </HashRouter>
      );
    }
    return (
        <div class="page-loader">
          <div
            class="loading"
            data-app-name={i18n.t("deviceVerificationSystem")}
          >
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
    );
  }
}

export default Loader;
