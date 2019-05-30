import React, {Component} from 'react';
import i18n from '../../i18n';

class Footer extends Component {
  render() {
    return (
    <footer className="app-footer">
        <div>&copy; {i18n.t('copyright')} 2018 <span>DIRBS</span>. {i18n.t('allRightsReserved')}.</div>
        <div><b>{i18n.t('Version')}: </b>1.0.0</div>
    </footer>
    )
  }
}
export default Footer;