import {
    checkCodeEnter,
    checkIDTo1CBase,
    createKeyboard,
    getBalanceTo1C,
    getEnteredMessage,
    getVerificationCode,
    registrationUser,
    sendSMSMobileGroup
} from "./src/CommonFunctions";
import { Users } from "./src/Users";

const TelegramBot = require("node-telegram-bot-api");
//const token = '1356849321:AAGYRYMGBGnnOzJCubrm2B3reK2qWZNXXV8'; //Node_test_zalimkhan_bot
const token = "1575102522:AAEqgjSsotYSPMuYnOYwJtzC7r_QqdIe15s"; // Ecco05
const bot = new TelegramBot(token, {
    polling: true
});
let chatID: string;
let checkIn1C: boolean;
let numberPhone: string;
let code: number;
let codeEnter: number;
let checkPhone: boolean = false;
let checkCode: boolean = false;

bot.onText(/\/start/, msg => {
    checkIDTo1CBase(msg, msg.chat.id, checkIn1C, bot);
    setTimeout(() => {
        if (Users.auth && Users.auth != undefined) {
            getBalanceTo1C(msg.chat.id).catch(error => console.log(error));
            createKeyboard(bot, msg.chat.id);
        } else
            bot.sendMessage(
                msg.chat.id,
                "Добро пожаловать! Введите команду /reg для регестрации."
            );
    }, 900);
});

bot.onText(/\/reg/, msg => {
    let UserCheck: boolean = checkIDTo1CBase(msg, chatID, checkIn1C, bot);
    console.log(UserCheck);
    if (UserCheck) {
        bot.sendMessage(msg.chat.id, "Вы прошли регестрацию");
    } else if (UserCheck != undefined) {
        code = getVerificationCode();
        bot.sendMessage(msg.chat.id, "Введите номер телефона (79*********)");
        checkPhone = false;
        checkCode = false;
        numberPhone = "";
    }
});
bot.on("message", msg => {
    numberPhone = getEnteredMessage(msg);
    let lenght = numberPhone.length;
    console.log("www" + checkPhone);
    if (numberPhone.match(/^\d+$/) && !checkPhone && checkCode == false) {
        registrationUser(
            bot,
            msg,
            (numberPhone = numberPhone),
            code,
            (checkPhone = true)
        ).catch(error => error);
        setTimeout(() => {
            sendSMSMobileGroup(code);
        }, 1000);
    }
});
bot.on("message", msg => {
    let text = msg.text;
    let length = text.length;
    if (text.match(/^\d+$/) && checkPhone && !checkCode && length < 5) {
        codeEnter = text;
        console.log(numberPhone);
        return checkCodeEnter(bot, msg, codeEnter, (checkCode = true));
    }
});

bot.onText(/Баланс/, msg => {
    let balance: string;
    getBalanceTo1C(msg.chat.id).catch(error => console.log(error));
    setTimeout(() => {
        balance = Users.balance;
        if (balance != undefined) {
            bot.sendMessage(msg.chat.id, balance);
        } else bot.sendMessage(msg.chat.id, "Зарегистрируйтесь, чтобы узнать баланс");
    }, 850);
});
