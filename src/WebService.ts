const fetch = require("node-fetch");
export class WebService {
    private _url: string = "http://192.168.1.162/InfoBase/hs/EccpBot/";
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
/**
 * checkRequestHTTP - проверяет состояние http запроса
 * Если 200 возращает true иначе false
 * */
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

/**
 * @param url
 * ParseJSON - Обрабатывает данные о кол-ве бонусных баллов пользователя.
 */
export async function ParseJSON(url) {
    let response = await fetch(url);
    let commit = await response.json();

    let data = JSON.stringify(commit);
    let balance =  JSON.parse(data);
    let strInBalance = ""
    let strBalance="";
    for(let key in balance){
if (balance[key].Period=="Сейчас") strInBalance = " баланс = ";
else strInBalance = " баланс будет = "
       strBalance+= (balance[key].Period +"," + strInBalance+"💰"+balance[key].Balance+"\n" )
    }
    return strBalance
}
