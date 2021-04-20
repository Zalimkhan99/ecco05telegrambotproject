import {checkCodeEnter, checkIDTo1CBase, createKeyboard, getBalanceTo1C, getEnteredMessage, getVerificationCode, registrationPhoneUser, sendSMSMobileGroup} from "./src/CommonFunctions";
import { Users } from "./src/Users";
const TelegramBot = require("node-telegram-bot-api");
/** выбор бота*/
//const token = '1347735458:AAFwL-fwNKCDwxGhTTofXnaVbzfJtrj18Ts';// @testZalim1c_bot
//const token = '1356849321:AAGYRYMGBGnnOzJCubrm2B3reK2qWZNXXV8'; //Node_test_zalimkhan_bot
const token = "1575102522:AAEqgjSsotYSPMuYnOYwJtzC7r_QqdIe15s"; // Ecco05 бот
const bot = new TelegramBot(token, {
    polling: true
});
/** Глабальные переменные */
let chatID: string;
let checkIn1C: boolean;
let numberPhone: string;
let code: number;
let codeEnter: number;
let checkPhone: boolean = false;
let checkCode: boolean = false;
/** Пользователь отправляет Start */
bot.onText(/\/start/, async msg => {
    await checkIDTo1CBase(msg, msg.chat.id, checkIn1C);
    await createKeyboard(bot, msg.chat.id);
    setTimeout(()=>{
        if (!Users.auth && Users.auth != undefined) {
            bot.sendMessage(
                msg.chat.id,
                "Нажмите на кнопку регистрация."
            );
        }
    },2)
});
/** Когда нажимают на клавишу регистрация */
bot.onText(/Регистрация/, msg => {
    let UserCheck: boolean = checkIDTo1CBase(msg, chatID, checkIn1C);
    console.log(UserCheck);
    if (UserCheck) {
        bot.sendMessage(msg.chat.id, "Вы уже прошли регистрацию");
    } else if (UserCheck != undefined) {
        code = getVerificationCode();/** запись в глобальную переменную сode*/
        bot.sendMessage(msg.chat.id, "Введите номер телефона (79*********)");
        checkPhone = false;
        checkCode = false;
        numberPhone = "";
    }
});
/**
 * registrationPhoneUser
 * @param numberPhone - присваивает  значание с глобальной переменой "numberPhone"
 * @param checkPhone -  присавивает глобальной переменной значение True
 */
bot.on("message", msg => {
    numberPhone = getEnteredMessage(msg);
    if (numberPhone.match(/^\d+$/) && !checkPhone && checkCode == false &&numberPhone.length>9) {

        registrationPhoneUser(bot, msg, (numberPhone = numberPhone), code, (checkPhone = true)).catch(error => error);

        setTimeout(() => {
            sendSMSMobileGroup(code,bot,msg); /** Отправка смски с кодом подтверждения*/
        }, 1500);
    }
    else if (numberPhone.match(/^\d+$/) && !checkPhone) {
        bot.sendMessage(msg.chat.id, "Недостаточно символов")
    }
});
/** Проверка введеного кода */
bot.on("message", msg => {
    let text = msg.text;
    let length = text.length;
    console.log(checkPhone +' проверка телефона');
    if (text.match(/^\d+$/) && checkPhone && !checkCode && length < 5) {
        codeEnter = text;
        console.log(numberPhone);
        return checkCodeEnter(bot, msg, codeEnter, (checkCode = true));
    }
});
/** Отправляет баланс пользователю */
bot.onText(/Баланс/, async msg => {
    checkIDTo1CBase(msg, chatID, checkIn1C);
    setTimeout(()=>{
        if ( Users.auth == false ) {
            bot.sendMessage(msg.chat.id, "Зарегистрируйтесь, чтобы узнать баланс");
        }
        else {
            getBalanceTo1C(msg.chat.id,bot).catch(error => console.log(error));
        }
    },900)
});
