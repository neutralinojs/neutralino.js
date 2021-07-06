// NOTE: fetch API looks modern than xhr. But, headers are getting lowercased.
// And browser headers are not lowercased. Why?
// Update when fetch API looks consistant with the browser.

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
    data?: any;
    url: string;
    type: RequestType;
}

export enum RequestType {GET = 'GET', POST = 'POST'};

export function request(options: RequestOptions): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
        let sendString: string = "";
        let xmlhttp: XMLHttpRequest = initXMLhttp();

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let responseObject: any = null;
                let responsePayload: string = xmlhttp.responseText;

                if(responsePayload)
                    responseObject = JSON.parse(responsePayload);

                if(responseObject && responseObject.success) {
                    if(responseObject.hasOwnProperty("returnValue"))
                        resolve(responseObject.returnValue);
                    else
                        resolve(responseObject);
                }
                if(responseObject && responseObject.error)
                    reject(responseObject.error);
            }
            else if(xmlhttp.readyState == 4) {
                reject("Neutralino server is offline. Try restarting the application");
            }
        }

        if(options.isNativeMethod)
            options.url = "http://localhost:" + window.NL_PORT + "/__nativeMethod_" + options.url;

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
    });
}
