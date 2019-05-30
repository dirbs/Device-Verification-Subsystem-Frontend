import React, {Component} from 'react';
import {
  Nav,
  NavbarBrand,
} from 'reactstrap';
import i18n from '../../i18n';

class Header extends Component {

  render() {
    return (
      <header className="app-header navbar">
        <NavbarBrand href="#">
            <h5 className="navbar-brand-minimized">DVS</h5>
            <h5 className="navbar-brand-full">{i18n.t("deviceVerificationSystem")}</h5>
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
        </Nav>
      </header>
    );
  }
}

export default Header;
