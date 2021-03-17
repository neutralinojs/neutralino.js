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
    isNativeMethod?: boolean;
    onSuccess?: Function;
    onError?: Function;
    data?: any;
    url: string;
    type: RequestType;
}

export enum RequestType {GET = 'GET', POST = 'POST'};

export function request(options: RequestOptions) {
    let sendString: string = "";

    let xmlhttp: XMLHttpRequest = initXMLhttp();

    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let responseObject: any = null;
            let responsePayload: string = xmlhttp.responseText;

            if(responsePayload)
                responseObject = JSON.parse(responsePayload);

            if(options.onSuccess && responseObject && responseObject.success)
                options.onSuccess(responseObject);
            if(options.onError && responseObject && responseObject.error)
                options.onError(responseObject.error);
        }
        else if(xmlhttp.readyState == 4) {
            if(options.onError)
                options.onError("Neutralino server is offline. Try restarting the application");
        }
    }

    if(options.isNativeMethod)
        options.url = "/__nativeMethod_" + options.url;

    if(options.data)
        sendString = JSON.stringify(options.data);

    if (options.type == "GET") {
        xmlhttp.open("GET", options.url, true);
        xmlhttp.setRequestHeader("Authorization", "Basic " + window.NL_TOKEN);
        xmlhttp.send();
    }

    if (options.type == "POST") {
        xmlhttp.open("POST", options.url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("Authorization", "Basic " + window.NL_TOKEN);
        xmlhttp.send(sendString);
    }
}
