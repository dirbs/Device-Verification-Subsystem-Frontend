/* SPDX-License-Identifier: BSD-4-Clause-Clear
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

  - Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
  - All advertising materials mentioning features or use of this software,
  or any deployment of this software, or documentation accompanying any
  distribution of this software, must display the trademark/logo as per the
  details provided here:
  https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
  - Neither the name of Qualcomm Technologies, Inc. nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.


SPDX-License-Identifier: ZLIB-ACKNOWLEDGEMENT
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
This software is provided 'as-is', without any express or implied warranty.
In no event will the authors be held liable for any damages arising from
the use of this software.
Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

  - The origin of this software must not be misrepresented; you must not
  claim that you wrote the original software. If you use this software in a
  product, an acknowledgment is required by displaying the trademark/logo as
  per the details provided here:
  https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
  - Altered source versions must be plainly marked as such, and must not
  be misrepresented as being the original software.
  - This notice may not be removed or altered from any source distribution.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER
OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

import React from 'react'
import CheckStatus from "./CheckStatus"
import {DeviceStatusTable} from "./CheckStatus"
import i18n from "./../../i18nTest"
import {I18nextProvider} from "react-i18next";
import Reaptcha from 'reaptcha';
import GOOGLE_RECAPTCHA_KEY from "./../../utilities/constants";

import mockAxios from 'axios'

//Device status table mock data
const mockImei = 12121212121212;
const compliant = {
  block_date: "N/A",
  inactivity_reasons: ["Your device is not registered"],
  link_to_help: "dirbs.net/help",
  status: "Non compliant",
  gsma: {}
};
const gsma = {}
const visible = true

const defaultProps = {
  sitekey: GOOGLE_RECAPTCHA_KEY,
  onVerify: Sinon.spy()
};
const renderSpy = Sinon.spy();
const executeSpy = Sinon.spy();
const resetSpy = Sinon.spy();

//Jest timer
jest.useFakeTimers();

beforeEach(() => {

  window.grecaptcha = {
    ready: callback => callback(),
    render: renderSpy,
    reset: resetSpy,
    execute: executeSpy
  };

  renderSpy.resetHistory();
  executeSpy.resetHistory();
  resetSpy.resetHistory();
});
describe("Check status component tests", () => {
  test("if renders correctly", () => {
    const wrapper = shallow(
      <CheckStatus/>);
    expect(wrapper).toMatchSnapshot()
  })
  test("if renders correctly again", () => {
    const wrapper = render(
      <I18nextProvider i18n={i18n}>
        <CheckStatus/>
      </I18nextProvider>
    )
    expect(wrapper).toMatchSnapshot()
  });
  test("if initial state is set correctly", () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <CheckStatus/>
      </I18nextProvider>
    )
    const state = wrapper.find('CheckStatus').state()
    expect(state.compliant).toEqual({})
    expect(state.gsma).toEqual({})
    expect(state.disableButton).toBe(false)
    expect(state.showDeviceStatusTable).toBe(false)
    expect(state.loader).toBe(false)
    expect(state.imei).toEqual(null)
    expect(state.setCaptcha).toBe(false)
  });
  test('validations',()=>{
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <CheckStatus/>
      </I18nextProvider>
    )

    wrapper.find('Formik').setState({
      values: {
        imei: ''
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    wrapper.find('Formik').setState({
      values: {
        imei: 'zzz123'
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')
    expect(wrapper.find('Formik').state().submitCount).toEqual(2)
  })
  test("if form submits", () => {
    let mockCompliant = {
      "status": "Non compliant",
      "block_date": "N/A",
      "link_to_help": "dirbs.net.pk/help",
      "inactivity_reasons": ["Your device is not registered"]
    }
    let mockGsma = {"brand": "Samsung", "model_name": "SM-G530H/DS"}
    let mockData = {
      gsma: mockGsma,
      compliant: mockCompliant,
      imei: mockImei
    }
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: mockData
      }),
    )
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <CheckStatus/>
      </I18nextProvider>
    )

    wrapper.find('CheckStatus').setState({
      disableButton: false,
      setCaptcha: true
    })

    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
    expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
  })
  test('if API call fails',()=>{
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <CheckStatus/>
      </I18nextProvider>
    )
    //Error undeifned
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error > 500
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 505
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error 409
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 409
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error 406
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 406
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error 405
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 405
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error 403
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 403
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error 401
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 401
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error 400
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 400
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
    //Error 404
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          data:{
            message: 'test error'
          },
          status: 404
        }
      }),
    )
    wrapper.find('Formik').setState({
      values: {
        imei: mockImei
      }
    })
    //Submit
    wrapper.find('form').simulate('submit')

    //Tests
     expect(wrapper.find('CheckStatus').state().loader).toEqual(false)
     expect(wrapper.find('CheckStatus').state().disableButton).toEqual(false)
     expect(wrapper.find('CheckStatus').state().showDeviceStatusTable).toEqual(false)
  })
})

describe("Device status table component", () => {
  test("if renders correctly", () => {
    const wrapper = shallow(<DeviceStatusTable/>);
    expect(wrapper).toMatchSnapshot()
  })
  test("if renders correctly again", () => {
    const wrapper = render(
      <I18nextProvider i18n={i18n}>
        <DeviceStatusTable/>
      </I18nextProvider>
    )
    expect(wrapper).toMatchSnapshot()
  });
  test("if props receive correctly", () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <DeviceStatusTable gsma={gsma} compliant={compliant} imei={mockImei}
                           visible={visible}/>
      </I18nextProvider>
    )
    const DeviceStatustable = wrapper.find('DeviceStatusTable')
    expect(DeviceStatustable.props().gsma).toEqual(gsma)
    expect(DeviceStatustable.props().compliant).toEqual(compliant)
    expect(DeviceStatustable.props().imei).toEqual(mockImei)
    expect(DeviceStatustable.props().visible).toEqual(visible)
  });
  test("if props renders table correctly", () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <DeviceStatusTable gsma={gsma} compliant={compliant} imei={mockImei}
                           visible={visible}/>
      </I18nextProvider>
    )
    const DeviceStatustable = wrapper.find('DeviceStatusTable')
    const cells = DeviceStatustable.find('td')
    expect(DeviceStatustable.find('.DeviceStatusTable_show').length).toEqual(1)
    expect(cells.at(0).text()).toBe('12121212121212')
    expect(cells.at(1).text()).toBe('N/A')
    expect(cells.at(2).text()).toBe('N/A')
    expect(cells.at(3).text()).toBe('Non compliant')
    expect(cells.at(4).text()).toBe('Your device is not registered')
    expect(cells.at(5).text()).toBe('dirbs.net/help')
  });
})

describe("Google Recaptcha", () => {
  test("should have default className", () => {
    const wrapper = mount(<I18nextProvider i18n={i18n}>
      <CheckStatus>
        <Reaptcha  {...defaultProps}/>
      </CheckStatus>
    </I18nextProvider>)
    expect(wrapper.find('.g-recaptcha').hostNodes().exists()).toBe(true)
  })
  test("should render recaptcha", () => {
    const onVerify = Sinon.stub();
    const onExpire = Sinon.stub();
    const onError = Sinon.stub();

    const wrapper = mount(<I18nextProvider i18n={i18n}>
      <CheckStatus>
        <Reaptcha
          sitekey={GOOGLE_RECAPTCHA_KEY}
          theme="light"
          size="normal"
          tabindex={2}
          onVerify={onVerify}
          onExpire={onExpire}
          onError={onError}
        />
      </CheckStatus>
    </I18nextProvider>)
    expect(renderSpy.calledOnce).toBe(true)
  })
  test("should add recaptcha script in body", () => {
    mount(<I18nextProvider i18n={i18n}>
      <CheckStatus>
        <Reaptcha {...defaultProps}/>
      </CheckStatus>
    </I18nextProvider>)
    const script = document.scripts[0];
    expect(script.async).toBe(true);
    expect(script.defer).toBe(true);
    expect(script.src).toEqual('https://recaptcha.net/recaptcha/api.js?render=explicit&hl=en');
  })
})

