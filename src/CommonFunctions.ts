import { Users } from "./Users";
import { checkRequestHTTP, ParseJSON, urlRequestHTTP } from "./WebService";

export function getVerificationCode() {
    let VerificationCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return VerificationCode;
}
export function getEnteredMessage(msg) {
    let textUser: string;
    let text = msg.text;
    if (text.match(/^\d+$/)) {
        textUser = text;
    } else textUser = "";
    return textUser;
}
export function checkIDTo1CBase(msg, chatID, checkIn1C, bot) {
    let urlCheck1C = urlRequestHTTP("chekidver/", msg.chat.id);
    checkRequestHTTP(urlCheck1C)
        .then(res => {
            if (!res) {
                Users.id = msg.chat.id;
                chatID = Users.id;
                checkIn1C = false;
                Users.auth = checkIn1C;
            } else {
                Users.id = msg.chat.id;
                chatID = Users.id;
                checkIn1C = true;
                Users.auth = checkIn1C;
            }
        })
        .then(() => console.log(checkIn1C));
    console.log(Users.auth);
    return Users.auth;
}
export async function registrationPhoneUser(bot, msg, phoneNumber, codeVer, checkPhone) {
    let urlCheckPhoneNumber = urlRequestHTTP("ecco99apitelegram/", phoneNumber, codeVer);
    checkRequestHTTP(urlCheckPhoneNumber)
        .then(res => {
            if (res) {
                Users.phone = phoneNumber;
                bot.sendMessage(msg.chat.id, "Введите код с СМС!");
                checkPhone = true;
            } else {
                checkPhone = false;
                bot.sendMessage(msg.chat.id, "Номер введен неправильно или ваши данные с анкеты не внесены, подождите 15 минут и попробуйте снова");
            }
        })
        .then(() => {
            console.log(urlCheckPhoneNumber);
        });
}

export function checkCodeEnter(bot, msg, code, checkCode) {
    let urlCheckCode = urlRequestHTTP("eccocheck/", Users.phone, code);
    checkRequestHTTP(urlCheckCode)
        .then(res => {
            if (res) {
                bot.sendMessage(msg.chat.id, "Регистрация прошла успешно!");
                checkCode = true;
                let id1C = urlRequestHTTP("iduserecco/", Users.id, Users.phone);
                console.log(id1C);
                checkRequestHTTP(id1C).catch(error =>
                    console.log(error + " id не записан")
                );
                console.log(id1C);
            } else {
                checkCode = false;
                bot.sendMessage(msg.chat.id, "Код не верный, нажмите на кнопку регистрация и повторите попытку.");
            }
        })
        .then(() => {
            console.log(urlCheckCode);
        });
}
export function sendSMSMobileGroup(code) {
    let urlSMSMobileGroup = urlRequestHTTP("sendcodever/", Users.phone, code);
    console.log(urlSMSMobileGroup);
    checkRequestHTTP(urlSMSMobileGroup).catch(error =>
        console.log(error + " sms with code, Don't send")
    );
}
export function createKeyboard(bot, chatId) {
    return bot.sendMessage(chatId, "Добро пожаловать!", {
        reply_markup: {
            keyboard: [["💰Баланс","🚀Сгораемые баллы","✅Постоянные баллы"],["🌀Регистрация "]]
        }
    });
}
export async function getBalanceTo1C(chatID,bot) {
    let urlBalance = urlRequestHTTP("authusertrue/", chatID);
    ParseJSON(urlBalance).then(r  =>{Users.balance =r ; bot.sendMessage(chatID,Users.balance+'💰') });
}
