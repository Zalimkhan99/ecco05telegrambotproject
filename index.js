process.env.NTBA_FIX_319 = 1;
//подключение модулей
const fetch = require("node-fetch");
const TelegramBot = require('node-telegram-bot-api');
const await = require('await')
const token = '1356849321:AAGYRYMGBGnnOzJCubrm2B3reK2qWZNXXV8'; // токен бота телеграм
const bot = new TelegramBot(token, {
	polling: true
});
//объявление глобальных переменных
var url = ''
var phone = '';
var newUrl = '';
var dataJSON = '';
var response = '';
var auth = false;
//создание промиса 
var promiseTelegramBot = new Promise((resove, regect) => {
	setTimeout(() => resove(1), 1000);
});
//команда start
promiseTelegramBot.then(function(resove) {
		return resove = bot.onText(/\/start/, msg => {
			bot.sendMessage(msg.chat.id, "Добро пожаловать, "+ msg.chat.first_name +" для авторизации введите команду /auth ");
		})
	})
	// команда auth
promiseTelegramBot.then(function(resove) {
		return resove = bot.onText(/\/auth/, msg => {
				let text = '';
				if (auth == true) {
					text = 'Вы авторизованы'
				} else text = 'Введите номер телефона:'
				bot.sendMessage(msg.chat.id, text);
			})
			//ввод номера телефона
	}).then(bot.on('message', msg => {
			phone = msg.text;
			if (phone.match(/^\d+$/)) {
				url = 'http://localhost/DemoRetail1/hs/tlg//List/' + phone;
				//url = 'http://localhost/InfoBase/hs/Demo/List/' + phone;
				newUrl = url;
				dataReq()
				async function dataReq() {
					response = await fetch(newUrl);
					if (response.ok) {
						let json = await response.text();
						dataJSON = json;
						auth = true;
						return bot.sendMessage(msg.chat.id, 'Чтоб узнать сколько осталось бонусов на вашей дисконтной карте, введите команду /info');
					} else if (!response.ok && auth == false) {
						bot.sendMessage(msg.chat.id, 'Номер введен не правильно или не зарегестрирован');
					} else bot.sendMessage(msg.chat.id, 'вы авторизованы');
				} //конец асинхронной функции
			} // конец if
		}) //конец колбека on message  
	)
	// команда info
promiseTelegramBot.then(function(resove) {
		return resove = bot.onText(/\/info/, msg => {
			if (dataJSON != '') {
				bot.sendMessage(msg.chat.id, dataJSON)
			} else bot.sendMessage(msg.chat.id, 'вы не авторизованы!')
		})
	})
	//команда exit
promiseTelegramBot.then(function(resove) {
	return resove = bot.onText(/\/exit/, msg => {
		auth = false;
		phone = '';
		url='';
		newUrl = '';
		dataJSON = '';
		response = '';
		bot.sendMessage(msg.chat.id, 'Всего доброго!')
	})
})