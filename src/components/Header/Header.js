import React, {Component} from 'react';
import {
  Nav,
  NavbarBrand,
} from 'reactstrap';

class Header extends Component {

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarBrand href="#">
            <h5 className="navbar-brand-minimized">DVS</h5>
            <h5 className="navbar-brand-full">Device Verification Subsystem</h5>
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
          {/*<HeaderLanguageDropdown {...this.props} switchLanguage={this.props.switchLanguage} />*/}
        </Nav>
      </header>
    );
  }
}

export default Header;
