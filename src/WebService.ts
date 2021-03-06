const fetch = require("node-fetch");
export class WebService {
    private _url: string = "http://192.168.1.162/InfoBase3/hs/TelegramBot/";
    public get url(): string {
        return this._url;
    }
}
export function urlRequestHTTP(
    method: string,
    param1: string,
    param2?: string
) {
    let url = new WebService().url;
    if (param2 != undefined) {
        return url + method + param1 + "/" + param2;
    } else {
        console.log(url + method + param1);
        return url + method + param1;
    }
}
export async function checkRequestHTTP(url: string) {
    let response1C = await fetch(url).catch(error => error);
    let auth;
    if (!response1C.ok) {
        auth = false;
    } else {
        auth = true;
    }
    return auth;
}
export async function ParseJSON(url) {
    let response = await fetch(url);
    let commit = await response.json();
    let data = JSON.stringify(commit);
    return data.replace(/["{()}]/g, " ");
}
