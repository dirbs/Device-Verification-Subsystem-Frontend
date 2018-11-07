/*Copyright (c) 2018 Qualcomm Technologies, Inc.
  All rights reserved.

  Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
  NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
import { toast } from 'react-toastify'
export function getAuthHeader () {
    return {
        // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
    }
}

// Generic Errors handling for Axios
export function errors (context, error) {
    if(typeof error !== 'undefined'){
        if(typeof error.response === 'undefined') {
            toast.error('API Server is not responding or You are having some network issues');
        } else {
            if(error.response.data.status_code === 400) {
                toast.error(error.response.data.message);
            } else if(error.response.data.status_code === 401) {
                toast.error('Access denied');
            } else if(error.response.data.status_code === 403) {
                toast.error('These credential do not match our records.');
            } else if(error.response.data.status_code === 404) {
                toast.error(error.response.data.message);
            } else if(error.response.data.status_code === 405) {
                toast.error('You have used a wrong HTTP verb');
            } else if(error.response.data.status_code === 406) {
                toast.error(error.response.data.message);
            } else if(error.response.data.status_code === 409) {
                toast.error(error.response.data.message, { autoClose: 10000 });
            } else if(error.response.data.status_code >= 500) {
                toast.error("API Server is not responding or You are having some network issues", { autoClose: 8000 });
            }
        }
    }
}