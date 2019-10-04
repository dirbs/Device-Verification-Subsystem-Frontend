/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import i18n from 'i18next';
import React from 'react';

const MySwal = withReactContent(Swal);

export function getAuthHeader () {
    return {
        // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
    }
}

export function SweetAlert(params){
    let title = params.title
    let message = params.message
    let type = params.type

    MySwal.fire({
        title: <p>{title}</p>,
        text: message,
        type: type,
        confirmButtonText: i18n.t('button.ok')
    })
}

/**
 * Generic Errors handling for Axios
 *
 * @param context
 * @param error
 */
export function errors (context, error) {
    if (typeof error !== 'undefined') {
        if (typeof error.response === 'undefined') {
            SweetAlert({
                title: i18n.t('error'),
                message: i18n.t('serverNotResponding'),
                type: 'error'
            })
            //toast.error('API Server is not responding or You are having some network issues');
        } else {
            if (error.response.status === 400) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: error.response.data.message,
                    type: 'error'
                })
                //toast.error(error.response.data.message);
            } else if (error.response.status === 401) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: i18n.t('sessionExpired'),
                    type: 'error'
                })
                //toast.error('Your session has been expired, please wait');
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else if (error.response.status === 403) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: i18n.t('credentialMatch'),
                    type: 'error'
                })
                //toast.error('These credential do not match our records.');
            } else if (error.response.status === 404) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: error.response.data.message,
                    type: 'error'
                })
                //toast.error(error.response.data.message);
            } else if (error.response.status === 405) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: i18n.t('wrongHttp'),
                    type: 'error'
                })
                //toast.error('You have used a wrong HTTP verb');
            } else if (error.response.status === 406) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: error.response.data.message,
                    type: 'error'
                })
                //toast.error(error.response.data.message);
            } else if (error.response.status === 409) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: error.response.data.message,
                    type: 'error'
                })
                //toast.error(error.response.data.message, { autoClose: 10000 });
            } else if (error.response.status === 422) {
                let errors = error.response.data.messages;
                for (var key in errors) {
                    var caseErrors = errors[key];
                    for (var i in caseErrors) {
                        SweetAlert({
                            title: i18n.t('error'),
                            message: caseErrors[i][0],
                            type: 'error'
                        });
                        //toast.error(caseErrors[i][0], { autoClose: 10000 });
                    }
                }
            } else if (error.response.status >= 500) {
                SweetAlert({
                    title: i18n.t('error'),
                    message: i18n.t('serverNotResponding'),
                    type: 'error'
                })
                //toast.error("API Server is not responding or You are having some network issues", { autoClose: 8000 });
            }
        }
    }
}
