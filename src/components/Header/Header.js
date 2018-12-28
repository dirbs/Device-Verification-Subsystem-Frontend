import React, {Component} from 'react';
import {
  Nav,
  NavbarBrand,
} from 'reactstrap';

class Header extends Component {

  render() {
    return (
      <header className="app-header navbar">
        <NavbarBrand href="#">
            <h5 className="navbar-brand-minimized">DVS</h5>
            <h5 className="navbar-brand-full">Device Verification Subsystem</h5>
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
        </Nav>
      </header>
    );
  }
}

export default Header;
