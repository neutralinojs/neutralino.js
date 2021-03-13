// MIT License

// Copyright (c) 2018 Neutralinojs

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function initXMLhttp() {
    let xmlhttp: XMLHttpRequest;
    if (window.XMLHttpRequest) {
        //code for IE7,firefox chrome and above
        xmlhttp = new XMLHttpRequest();
    }
    else {
        //code for Internet Explorer
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

export interface RequestOptions {
    onSuccess?: Function;
    onError?: Function;
    data?: any;
    url: string;
    type: string;
}

export function request(config: RequestOptions) {
    let sendString: string = "";

    let xmlhttp: XMLHttpRequest = initXMLhttp();

    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (config.onSuccess) {
                config.onSuccess(JSON.parse(xmlhttp.responseText));
            }
        }
        else if(xmlhttp.readyState == 4) {
            if(config.onError){
                config.onError("Neutralino server is offline");
            }
        }
    }

   if(config.data)
        sendString = JSON.stringify(config.data);

    if (config.type == "GET") {
        xmlhttp.open("GET", config.url, true);
        xmlhttp.setRequestHeader("Authorization", "Basic " + window.NL_TOKEN);
        xmlhttp.send();
    }

    if (config.type == "POST") {
        xmlhttp.open("POST", config.url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("Authorization", "Basic " + window.NL_TOKEN);
        xmlhttp.send(sendString);
    }
}
