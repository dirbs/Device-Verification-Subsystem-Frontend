/*Copyright (c) 2018 Qualcomm Technologies, Inc.
  All rights reserved.

  Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the
  limitations in the disclaimer below) provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this list of conditions and the following
  disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
* disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote
* products derived from this software without specific prior written permission.
  NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS
  PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
  BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
   IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
   WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
   USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
import axios from 'axios';
import React, {Component} from 'react';
import {translate, I18n} from 'react-i18next';
import {Card, CardTitle, FormGroup, Label, Input, FormFeedback, Form} from 'reactstrap';
import {withFormik, Field} from 'formik';
import {getAuthHeader, errors} from '../../utilities/helpers'
import {GOOGLE_RECAPTCHA_KEY, BASE_URL} from '../../utilities/constants'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BoxLoader from '../../components/BoxLoader/BoxLoader'
import Reaptcha from 'reaptcha';
import i18n from '../../i18n'

const renderInput = ({
                       field, // { name, value, onChange, onBlur }
                       form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                       ...props
                     }) => {
  const states = (touched[field.name] && errors[field.name]) ? false : null;
  return (
    <FormGroup>
      <Label>{props.label} {props.requiredStar && <span className="text-danger">*</span>}</Label>
      <Input {...field} type={props.type} placeholder={props.placeholder} valid={states} maxLength="16"/>
      {touched[field.name] &&
      errors[field.name] && <FormFeedback style={{'display': 'block'}}>{errors[field.name]}</FormFeedback>}
    </FormGroup>
  )
};

class CheckStatusForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      captchaResponse: ''
    }
    this.handleVerify = this.handleVerify.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleVerify(response) {
    if (response) {
      this.setState({
        captchResponse: response
      })
      this.props.toggleCaptcha(response)
    }
  }

  handleClick() {
    this.captcha.reset()
    this.setState({verified: false})
  }

  render() {
    const {
      handleSubmit,
      isValid,
      disableButton,
      setCaptcha,
      loading
    } = this.props
    return (
      <I18n ns="translations">
        {
          (t) => (
            <Form onSubmit={handleSubmit}>
              <Field name="imei" component={renderInput} label={t('checkStatus.label')} type="text"
                     placeholder={t('checkStatus.placeholder')} requiredStar/>
              <div className="form-group">
                {!loading &&
                <div className="g-recaptcha">
                  <Reaptcha ref={e => (this.captcha = e)} render="explicit" sitekey={GOOGLE_RECAPTCHA_KEY}
                            onVerify={this.handleVerify}
                            hl={i18n.language}
                  />
                </div>
                }
              </div>
              <div className="row justify-content-center">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <button className="btn btn-primary btn-block" onClick={() => {
                      this.captcha.reset()
                    }} type="submit"
                            disabled={!(isValid || disableButton) || (isValid && (disableButton || !setCaptcha))}>{t('submit')}</button>
                  </div>
                </div>
              </div>
            </Form>
          )
        }
      </I18n>
    )
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({imei: ""}),
  validate: (values) => {
    let errors = {};
    // IMEIs Validation
    if(!values.imei){
      errors.imei = 'This field is Required'
    } else if(!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imei)) {
      errors.imei = 'IMEI must contain 14 to 16 characters and contains a combination of [0-9] and [A-F]'
    }
    return errors;
  },
  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    //Call Props function for Sever Call
    bag.props.callServer(values.imei)
  },
  displayName: 'CheckStatusForm', // helps with React DevTools
})(CheckStatusForm);

export const DeviceStatusTable = ({
                             ...props
                           }) => {
  return (
    <I18n ns="translations">
      {
        (t) => (
          <div className={props.visible ? 'animated DeviceStatusTable_show' : 'animated DeviceStatusTable_hide'}>
            <div className="row justify-content-center">
              <div className="col-xl-10">
                <Card>
                  <CardTitle className="card-header">{t('deviceStatusTable.title')}</CardTitle>
                  <div className="card-body p0">
                    <div className="react-bs-table-container">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0">
                          <tbody>
                          <tr>
                            <th>IMEI</th>
                            <td>{props.imei}</td>
                          </tr>
                          <tr>
                            <th>{t('deviceStatusTable.brand')}</th>
                            <td>{props.gsma && (props.gsma.brand || 'N/A')}</td>
                          </tr>
                          <tr>
                            <th>{t('deviceStatusTable.modelName')}</th>
                            <td>{props.gsma && (props.gsma.model_name || 'N/A')}</td>
                          </tr>
                          <tr>
                            <th>{t('deviceStatusTable.complianceStatus')}</th>
                            <td>{props.compliant && (props.compliant.status || 'N/A')}</td>
                          </tr>
                          { props.compliant &&
                          <tr>
                            <th>{t('deviceStatusTable.reason')}</th>
                            <td>{props.compliant.inactivity_reasons && (props.compliant.inactivity_reasons.join(", ") || 'N/A')}</td>
                          </tr>
                          }
                          <tr>
                            <th>{t('deviceStatusTable.link')}</th>
                            <td>{(props.compliant && <a
                              href={`http://www.${props.compliant.link_to_help}`}>{props.compliant.link_to_help}</a>) || 'N/A'}</td>
                          </tr>
                          <tr>
                            <th>{t('deviceStatusTable.date')}</th>
                            <td>{(props.compliant && props.compliant.block_date) || 'N/A'}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )
      }
    </I18n>
  )
};

class CheckStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliant: {},
      gsma: {},
      disableButton: false,
      showDeviceStatusTable: false,
      loader: false,
      imei: null,
      captchaResponse: '',
      setCaptcha: false
    }
    this.getDeviceStatus = this.getDeviceStatus.bind(this);
    this.toggleRecaptcha = this.toggleRecaptcha.bind(this);
  }

  toggleRecaptcha(response) {
    this.setState({
      setCaptcha: !this.state.setCaptcha,
      captchaResponse: response
    })
  }

  // Google Recapta Resource
  componentDidMount() {
    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  getDeviceStatus(imei) {
    let config = {
      headers: getAuthHeader()
    }
    this.setState({
      loader: true,
      disableButton: true,
      compliant: {},
      gsma: {},
    })
    //Get IMEI Status

    axios.get(BASE_URL + `/basicstatus?imei=${imei}&token=${this.state.captchaResponse}&source=web`, config)
      .then((response) => {
        if (response.data.compliant) {
          this.setState({
            compliant: response.data.compliant,
          });
        }
        if (response.data.gsma) {
          this.setState({
            gsma: response.data.gsma
          });
        }
        this.setState({
          imei: response.data.imei,
          showDeviceStatusTable: true,
          disableButton: false,
          loader: false
        });
        this.setState({
          setCaptcha: false
        });
      })
      .catch((error) => {
        this.setState({
          loader: false,
          disableButton: false,
          showDeviceStatusTable: false,
          setCaptcha: false
        })
        errors(this, error)
      })
  }

  render() {
    return (
      <I18n ns="translations">
        {
          (t) => (
            <div>
              <ToastContainer/>
              <div className="animated fadeIn mt-2rem">
                <div className="row justify-content-center">
                  <section className="col-xl-6">
                    <Card>
                      <CardTitle className="card-header">{t('checkStatus.header')}</CardTitle>
                      <div className="card-body">
                        <MyEnhancedForm loading={this.state.loader} toggleCaptcha={this.toggleRecaptcha}
                                        setCaptcha={this.state.setCaptcha} disableButton={this.state.disableButton}
                                        setSubmitting={this.state.setSubmitting} callServer={this.getDeviceStatus}/>
                      </div>
                    </Card>
                  </section>
                </div>
              </div>
              {
                (this.state.loader)
                  ?
                  (
                    <div style={{width: '70%', margin: '0 auto'}}>
                      <BoxLoader/>
                    </div>
                  )
                  :
                  <DeviceStatusTable gsma={this.state.gsma} compliant={this.state.compliant} imei={this.state.imei}
                                     visible={this.state.showDeviceStatusTable}/>
              }
            </div>
          )
        }
      </I18n>
    )
  }
}

export default translate('translations')(CheckStatus);
