import { Utils } from "lib"
import utils from "../utils"
import http from "./http"
import { HTTPDataFormat, HTTPMethod, HTTPResponseType } from "./types"

export default class HttpRequest {

    method: HTTPMethod = 'GET'
    url: string = ''
    baseUrl?: string
    body: any = {}
    queryParams: any = {}
    headers: any = {}
    tokenOverride?: string | null;
    dataFormat: HTTPDataFormat = 'json';
    converter: ((response: any) => any) = (v: any) => v;
    isRefresh: boolean = false;
    responseType: HTTPResponseType = 'json';
    fullResponse: boolean = false;
    refreshConsumed: boolean = false;
    promiseCallbacks?: {
        resolve: (response: any) => void,
        reject: (error: any) => void
    }
    timeoutTime?: number;
    timeoutRetries: number = 1;

    fakeResponse?: (resolve: (response: any) => void, reject: (error?: any) => void) => void

    useFake(faker:
        (
            resolve: (response: any) => void,
            reject: (error?: any) => void
        ) => void
    ): HttpRequest {
        this.fakeResponse = faker;
        return this;
    }

    setMethod(method: HTTPMethod): HttpRequest {
        this.method = method;
        return this;
    }

    transform(converter: (response: any) => any) {
        this.converter = converter;
        return this;
    }

    map(converter: (item: any) => any, prop?: string) {
        if (!prop) {
            this.converter = response => response.map(converter);
        }
        else {
            this.converter = response => ({
                ...response,
                [prop]: response[prop].map(converter)
            })
        }
        return this;
    }

    parseAs(className: any, prop?: string): HttpRequest {

        this.transform(response => {

            let val = prop ? response[prop] : response;
            if (!val) return response;

            if (Array.isArray(val)) {
                val = val.map(item => new className(item));
            }
            else val = new className(val);

            if (prop) {
                response[prop] = val;
            }

            return prop ? response : val;
        })

        return this;
    }

    data(data: any): HttpRequest {
        if (!data) {
            this.body = {};
            return this;
        }
        if (typeof data == 'string') {
            this.body = data;
            return this;
        }

        const obj = data.export && typeof data.export == 'function' ?
            data.export() : data;

        const dta = utils.removeUndefined(obj);

        if (this.method == 'GET') {
            this.setQueryParams(dta);
        } else {
            Object.keys(dta)
                .forEach((k: string) => {
                    this.body[k] = dta[k];
                })
        }
        return this;
    }

    setQueryParams(params: any) {
        Object.keys(params)
            .forEach((k: string) => {
                this.queryParams[k] = params[k];
            })
        return this;
    }

    setUrl(url: string): HttpRequest {
        this.url = url;
        if (url.length > 4 && url.startsWith('http')) {
            this.noBaseURL();
        }
        return this;
    }

    setBaseURL(base: string): HttpRequest {
        this.baseUrl = base;
        return this;
    }

    noBaseURL(): HttpRequest {
        return this.setBaseURL('');
    }

    setHeaders(headers: any): HttpRequest {
        this.headers = headers;
        return this;
    }

    setTokenOverride(token: string | null): HttpRequest {
        this.tokenOverride = token;
        return this;
    }

    withoutToken(): HttpRequest {
        return this.setTokenOverride(null);
    }

    setDataFormat(format: HTTPDataFormat): HttpRequest {
        this.dataFormat = format;
        return this;
    }

    multipart() : HttpRequest {
        return this.setDataFormat('formData');
    }

    urlencoded() : HttpRequest {
        return this.setDataFormat('urlencoded');
    }

    setResponseType(type: HTTPResponseType) : HttpRequest {
        this.responseType = type;
        return this;
    }

    download(fileName: string) {
        this.setResponseType('blob');
        return this.then(blob => {
            Utils.downloadBlob(blob, fileName);
        })
    }

    toFile(fileName: string) {
        this.setResponseType('blob');
        return this.then(blob => new File([blob], fileName))
    }

    toSrc() {
        this.setResponseType('blob');
        return this.then(blob => URL.createObjectURL(blob))
    }

    promise() : Promise<any> {
        return http.exec(this);
    }

    then(callback: (value: any) => void) {
        return http.exec(this).then(callback);
    }

    getFullResponse() {
        this.fullResponse = true;
        return this;
    }

    setTimeout(seconds: number = 10, retries: number = 1) {
        this.timeoutTime = seconds;
        this.timeoutRetries = retries;
        return this;
    }

    generateUrl() {

        const data = this.body ?? {}

        let urlparams = '';
        let char = '?';
        const addParams = (data: any) => {
            Object.keys(data).forEach(k => {
                const val = data[k];

                if (Array.isArray(val)) {

                    for (const i of val) {
                        urlparams += char + k + '=' + encodeURIComponent(i);
                        char = '&';
                    }

                } else {
                    urlparams += char + k + '=' + encodeURIComponent(data[k]);
                    char = '&';
                }
            });
        }

        if ("GET" == this.method) {
            addParams(data);
        }

        addParams(this.queryParams);

        return (this.baseUrl ?? '') + this.url + urlparams;
    }

}