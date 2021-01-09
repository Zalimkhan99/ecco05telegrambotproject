const TelegramBot = require('node-telegram-bot-api')
const token = '1356849321:AAGYRYMGBGnnOzJCubrm2B3reK2qWZNXXV8';
const bot = new TelegramBot(token, {polling:true});
const fetch1 = require("node-fetch");
const url = 'http://192.168.1.162/InfoBase3/hs/TelegramBot/';
let checkAuthFlag = false; // проверят существует ли пользователь
let auth = false; // проверяет авторизирован ли пользователь
let chatId = ''; //ид пользователя
let phone = ''; //номер телефона
let codeIn =''; // проверочный код
let balance = '';
let response= '';

async function  checkTelegramIdInBase1C (){
    let checkIdURL= url+'chekidver/'+chatId ;
    let response1C = await fetch1(checkIdURL)
    console.log(checkIdURL);
    if(!response1C.ok){
        auth = false;
        checkAuthFlag = false;
        //phone = '';
         codeIn = '';
        // response = '';
        return false;
    }
    else {
        auth = true;
        checkAuthFlag = true;
        console.log(auth);
        return true;
    }

}

function createKeyboard(){

    return (bot.sendMessage(chatId,balance.replace(/["{()}]/g, ' '),{
    reply_markup: {
        keyboard:[['Баланс']]
    }
 }))
}


// заприсывает сhartId пользователя
bot.on('message', msg=>{

    chatId = msg.chat.id;
    //setTimeout(()=>{
     //   checkTelegramIdInBase1C ();
   // },1)

})
// отрабатывает при клики на клавишу
async function sendTextClickInKeyboard() {

    let flagTauth= checkTelegramIdInBase1C();
    if(!flagTauth){

    let urlGetBalance = url+'infobonus/'+phone;
    response = await fetch1 (urlGetBalance);
    let commit =  response.json();
    balance= JSON.stringify(commit);
    return balance;
    }
    else {

        let urlGetBalance = url+'authusertrue/'+chatId;
        response = await fetch1 (urlGetBalance);
        let commit = await response.json();
        balance= JSON.stringify(commit);
        return balance;
    }

}

// создает клавиатуру
/*
function sendKeyboard() {
    if(auth){
        console.log(auth)
        bot.sendMessage(chatId,"Чтоб узнать кол-во баллов нажмите на кнопку",{
            'reply_markup':JSON.stringify({
                'inline_keyboard':[
                    [{text: 'Баланс' , callback_data: '1_1'}]
                ]
            })
        })
    }
}
*/
// создает проверочный код
function createVerificationCode(){
    let VerificationCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return VerificationCode;
}
let codeVer = createVerificationCode();
//когда боту отправляем комнду /start
bot.onText(/\/start/, msg => {


let check = checkTelegramIdInBase1C();
codeVer = createVerificationCode();
phone='';
checkAuthFlag= false;
console.log(check+' -chektest')
    chatId = msg.chat.id;
setTimeout(()=>{
    let text = '';

    console.log(check);
    if (auth == true&& check) {
        text = 'Добро пожаловать! ' + msg.chat.first_name;
        setTimeout(()=>{
            sendTextClickInKeyboard();
        },100)
        setTimeout(()=>{
            createKeyboard();
        },1200)
    } else text = 'Введите номер телефона (79*********): '
    bot.sendMessage(msg.chat.id, text);
},1000)


})
// отправляет сообщение с кодом проверки
async function sendHttpSMSMobileGroup( ){
    let authurl = url+'sendcodever/'+phone+ '/'+ codeVer;
    console.log(authurl);
    let responseCheckUser= await fetch1(authurl);
    console.log(responseCheckUser.status)
    if(responseCheckUser.ok){console.log(chatId)}
    return responseCheckUser
}

//отправить telegram id в 1С
async function sendHttpTelegramId( codeVer){
    let authurl = url+'iduserecco/'+chatId+ '/'+ phone;
    console.log(authurl);
    let responseCheckUser= await fetch1(authurl);
    //console.log(responseCheckUser.status)
    if(responseCheckUser.ok){console.log(chatId)}
    return responseCheckUser
}
//проверяем пользователя в базе и записываем в регистр проверечный код
async function checkHttpNumberPhoneUser( codeVer){
    let authurl = url+'ecco99apitelegram/'+phone+ '/'+ codeVer;
    console.log(authurl);
    let responseCheckUser= await fetch1(authurl);
    //console.log(responseCheckUser.status)
    if(responseCheckUser.ok){
        checkAuthFlag=true;
        bot.sendMessage(chatId,"Введите код с смс");
        sendHttpSMSMobileGroup();
    }
    else bot.sendMessage(chatId,"Номер введен не верно или вас нет в базе. (79********* без пробелов)")
    return responseCheckUser
}
//проверка введеного проверочного кода
async function checkHttpVerificationCode(codeVer){
    let authurl = url+'eccocheck/'+phone+ '/'+ codeVer;
   // console.log(authurl);
    let responseCheckUser= await fetch1(authurl);
    //console.log(responseCheckUser.status)
    if(responseCheckUser.ok){
        auth=true;bot.sendMessage(chatId,"Вы идентифицировали свой номер, в нашей базе");
        sendHttpTelegramId()
        setTimeout(()=>{
            sendTextClickInKeyboard();
        },100)
       setTimeout(()=>{
           createKeyboard();
       },1200)


       // sendKeyboard();
        //sendTextClickInKeyboard();

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
//получение данных при нажатии на кнопку Баланс
/*
bot.on('callback_query', query=>{
    chatId = query.message.chat.id;

    setTimeout(()=>{
        checkTelegramIdInBase1C ();
    },0)

    setTimeout(()=>{
        if(auth == true){
            sendTextClickInKeyboard();
            bot.sendMessage(query.message.chat.id, balance.replace(/["{()}]/g, ' '));
        }
    },100)
    setTimeout(()=>{
        if(auth ==false) bot.sendMessage(query.message.chat.id, "Введите свой номер, чтобы узнать баланс")

    },3000)



})

 */

bot.on('message', msg=>{
    let textMsg = msg.text;
    chatId = msg.chat.id;

   // checkTelegramIdInBase1C();
    if(textMsg=='Баланс') {
        sendTextClickInKeyboard();
        console.log(auth)
    }
    setTimeout(()=>{
        if(auth==true&&textMsg=='Баланс'){
            createKeyboard();
        }
        else if(auth==false&&textMsg=='Баланс') bot.sendMessage(chatId, 'Введите свой номер телефона, чтоб посмотрерть баланс(79*********)')
    },100)

})
