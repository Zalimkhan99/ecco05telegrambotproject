const TelegramBot = require('node-telegram-bot-api')
const fetch = require("node-fetch");
const token = '1356849321:AAGYRYMGBGnnOzJCubrm2B3reK2qWZNXXV8';
const bot = new TelegramBot(token, {polling:true});


const url = 'http://192.168.1.162/InfoBase3/hs/TelegramBot/';
let checkAuthFlag = false; // проверят существует ли пользователь
let auth = false; // проверяет авторизирован ли пользователь
let chatId = ''; //ид пользователя
let phone = ''; //номер телефона
let codeIn =''; // проверочный код

bot.on('message', msg=>{
    chatId = msg.chat.id;
})



function createVerificationCode(){
    let VerificationCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return VerificationCode;
}
let codeVer = createVerificationCode();
//когда боту отправляем комнду /start
bot.onText(/\/start/, msg => {
    let text = '';
    chatId = msg.chat.id;
    if (auth == true) {
        text = 'Добро пожаловать! ' + msg.chat.first_name;
    } else text = 'Введите номер телефона (79*********): '
    bot.sendMessage(msg.chat.id, text);

})

async function sendHttpSMSMobileGroup( ){
    let authurl = url+'sendcodever/'+phone+ '/'+ codeVer;
    console.log(authurl);
    let responseCheckUser= await fetch(authurl);
    console.log(responseCheckUser.status)
    if(responseCheckUser.ok){console.log(chatId)}
    return responseCheckUser
}

    //отправить telegram id в 1С
async function sendHttpTelegramId( codeVer){
    let authurl = url+'iduserecco/'+chatId+ '/'+ phone;
    console.log(authurl);
    let responseCheckUser= await fetch(authurl);
    console.log(responseCheckUser.status)
    if(responseCheckUser.ok){console.log(chatId)}
    return responseCheckUser
}
    //проверяем пользователя в базе и записываем в регистр проверечный код
 async function checkHttpNumberPhoneUser( codeVer){
     let authurl = url+'ecco99apitelegram/'+phone+ '/'+ codeVer;
     console.log(authurl);
     let responseCheckUser= await fetch(authurl);
     console.log(responseCheckUser.status)
     if(responseCheckUser.ok){
         checkAuthFlag=true;
         bot.sendMessage(chatId,"Введите код с смс");
           sendHttpSMSMobileGroup();
     }
     else bot.sendMessage(chatId,"Номер введен не верно или вас нет в базе. (79********* без пробелов)")
     return responseCheckUser
 }
//проверка проверочного кода
async function checkHttpVerificationCode(codeVer){
    let authurl = url+'eccocheck/'+phone+ '/'+ codeVer;
    console.log(authurl);
    let responseCheckUser= await fetch(authurl);
    console.log(responseCheckUser.status)
    if(responseCheckUser.ok){
        auth=true;bot.sendMessage(chatId,"Вы идентифицировали свой номер, в нашей базе");
        sendHttpTelegramId();
    }
    else bot.sendMessage(chatId,"код неверный!");

    return responseCheckUser
}



// срабоатет когда введем номер телефона
bot.on ('message',  msg=> {
   let  phoneIn = msg.text;

    if (checkAuthFlag== false && phoneIn.match(/^\d+$/)){
        phone= phoneIn;
        checkHttpNumberPhoneUser(codeVer);

    }
})

// проверка введного  кода
bot.on('message', msg=>{
    let code = msg.text;
    codeIn = code;
    if(code.match(/^\d+$/)&& auth==false&& checkAuthFlag==true){
        checkHttpVerificationCode(code);
    }
})












