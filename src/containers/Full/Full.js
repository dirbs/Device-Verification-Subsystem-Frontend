import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Footer from '../../components/Footer/';
import { translate } from 'react-i18next';
//import i18n from './../../i18n';

import CheckStatus from "../../views/CheckStatus/CheckStatus";

class Full extends Component {
  
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(lng) {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
  }
  render() {
    return (
      <div className="app">
        <Header {...this.props} switchLanguage={this.changeLanguage} />
        <div className="app-body">
          <main className="main">
            <Container fluid>
              <Switch>
                <Route path="/checkimei" name="CheckImei"  component={CheckStatus} />
                <Redirect from="/" to="/checkimei"/>
              </Switch>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export default translate('translations')(Full);
