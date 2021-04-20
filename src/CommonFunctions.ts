import { Users } from "./Users";
import { checkRequestHTTP, ParseJSON, urlRequestHTTP } from "./WebService";
/**
 *getVerificationCode - Создает 4-х знч. код   для подтв. регистрации
 **/
export function getVerificationCode() {
    let VerificationCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return VerificationCode;
}
/**
*getEnteredMessage- Проверяет полученные сообщения от пользователей
* Если текст сообщения начинатся с цифры то
* записывает в переменную этот текс и возвращает его.
* @param msg -  метод Telegram для работы с полученными сообщениями от пользователей.
* Более подробней описано в документации https://github.com/yagop/node-telegram-bot-api
* */
export function getEnteredMessage(msg) {
    let textUser: string;
    let text = msg.text;
    if (text.match(/^\d+$/)) {
        textUser = text;
    } else textUser = "";
    return textUser;
}
/**
 *  checkIDTo1CBase - функция проверяет есть ли пользователь в базе 1с по телеграм ид.
 *  @param msg - метод API Telegram бота. msg - метод для работы с полученными сообщениями от пользователей.
 *  @param chatID- записывает id в  глобальную переменную,
 *  @param checkIn1C - в глобальную переменую устанвливает значение true или false
 */
export function checkIDTo1CBase(msg, chatID, checkIn1C) {
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
/**
 * registrationPhoneUser- функция - Провекра, есть ли  номер телефона  в базе.
 * @param bot - API telegram bot
 * @param msg - метод API Telegram бота. msg - метод для работы с полученными сообщениями от пользователей
 * @param phoneNumber  -  Получает номер телефона с глобальной переменной
 * @param code  - получает код подтверждения  с глобальной перемнной.
 * @param checkPhone checkPhone- записывает в глобальную переменную есть ли тел. номер в базе.
 */
export async function registrationPhoneUser(bot, msg, phoneNumber, code, checkPhone) {
    let urlCheckPhoneNumber = urlRequestHTTP("ecco99apitelegram/", phoneNumber, code);
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
/**
 * checkCodeEnter - функция проверят введный код пользователя
 * @param bot - API telegram bot
 * @param msg - метод API Telegram бота. msg - метод для работы с полученными сообщениями от пользователей
 * @param code - получает сode с глобальной переменной
 * @param checkCode - записывает true или false в глобальную переменную
 *если регистрация прошла успешно, тогда Телеграм ID записывается в базу.
 */
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

/**
 *sendSMSMobileGroup - отправляет смс с кодом пользователю.
 * @param code - получает код с глобальнной переменной
 * @param bot - API telegram bot
 * @param msg - Метод API Telegram бота. msg - метод для работы с полученными сообщениями от пользователей
 */
export async function  sendSMSMobileGroup(code,bot,msg) {
    let urlSMSMobileGroup = await urlRequestHTTP("sendcodever/", Users.phone, code);
    let check = await checkRequestHTTP(urlSMSMobileGroup)
    console.log(check+" status smsMobileHTTP")
    if(check==false){
        bot.sendMessage(msg.chat.id, "Если смс не пришло, через 10 мин кликнете на кнопку регистрация и ввдеити номер повторно")
    }
    console.log(urlSMSMobileGroup);
    checkRequestHTTP(urlSMSMobileGroup).catch(error =>
       console.log(error)
    );
}
/**
 * createKeyboard - создает клавиатуру
 * @param bot - API telegram bot
 * @param chatId - получает ID с глобальной переменной
 */
export function createKeyboard(bot, chatId) {
    return bot.sendMessage(chatId, "Добро пожаловать!", {
        reply_markup: {
            keyboard: [["💰Баланс"],["🌀Регистрация "]]
        }
    });
}
/**
 * getBalanceTo1C - Получает баланс с базы и отправляет его пользователю
 * @param chatID - получает ID с глобальной переменной
 * @param bot - API telegram bot
 */
export async function getBalanceTo1C(chatID,bot) {
    let urlBalance = urlRequestHTTP("authusertrue/", chatID);
    ParseJSON(urlBalance).then(r  =>{Users.balance =r ; bot.sendMessage(chatID,Users.balance) });
}
