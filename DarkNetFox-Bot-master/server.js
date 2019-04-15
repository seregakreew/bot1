const { createCanvas, loadImage, registerFont } = require('canvas')
const { VK, Keyboard }        = require("vk-io");
const vk            = new VK();
const { updates }   = vk;
const fetch = require('node-fetch');
const fs            = require("fs");
const moment        = require("moment");
const utils = require("./utils");
const generator = require('generate-password');

const http = require("http");
const request = require("request");
const os = require("os");
vk.setOptions({
    token: process.env.TOKEN,
    apiMode: "parallel",
    pollingGroupId: 179364340
});

updates.use(async (context, next) => {
    if (context.is("message") && context.isOutbox)
        return;
    
// Проверка на наличие текста
      if (context.text) {
        console.log(`@id${context.senderId} ${ context.isChat ? "#" + context.chatId : "" }, text: ${ context.text.slice(0, 36) }`);
    } 
    if(context.isGroup) {
        return
    } 
    if (context.senderId < 0) {
        return;
    }

    try {
        await next();
    } catch (err) { console.error(err) }
});

const utils_1 = {
	sp: (int) => {
		int = int.toString();
		return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
	},
	rn: (int, fixed) => {
		if (int === null) return null;
		if (int === 0) return '0';
		fixed = (!fixed || fixed < 0) ? 0 : fixed;
		let b = (int).toPrecision(2).split('e'),
			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
			c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3) ).toFixed(1 + fixed),
			d = c < 0 ? c : Math.abs(c),
			e = d + ['', 'тыс', 'млн', 'млрд', 'трлн'][k];

			e = e.replace(/e/g, '');
			e = e.replace(/\+/g, '');
			e = e.replace(/Infinity/g, 'ДОХЕРА');

		return e;
	},
	gi: (int) => {
		int = int.toString();

		let text = ``;
		for (let i = 0; i < int.length; i++)
		{
			text += `${int[i]}&#8419;`;
		}

		return text;
	},
	decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
	random: (x, y) => {
		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
	},
	pick: (array) => {
		return array[utils.random(array.length - 1)];
	}
}
//Статистика сообщений беседы
updates.hear(/^score$/i, async (context) => {
	if (!~admins.indexOf(context.senderId)) {
    context.send(`[id${context.senderId}|${context.user.nick}], у вас не достаточно прав.`)
  } else {
			var sex = os.freemem() / 1024 / 1024;
			var totalmem = os.totalmem() / 1024 / 1024;
			var cpu = os.cpus();
    	context.send("🖥Информация о системе:\n&#4448;💻ОС: "+os.type()+"\n&#4448;💻Arch: "+os.arch()+"\n&#4448;💻Platform: "+os.platform()+"\n&#4448;💻Release: "+os.release()+"\n\n⚙Информация о железе: "+"\n&#4448;🔧RAM: "+Math.round(sex)+" / "+Math.round(totalmem)+" mb"+"\n&#4448;🔧CPU: "+cpu[0].model+"\n\n🛠Информация о процессе:"+"\n&#4448;💿PID: "+process.pid+"\n&#4448;💿Title: "+process.title+"\n&#4448;💿Node: "+process.version)
	}
})

updates.hear(/(?:~)([0-9]+)/i, async(context) => {
    if(!Number(context.$match[1])) {
        return context.send(`У вас не число`)
    }
    let
    number_0 = context.$match[1],
    number_1 = context.$match[1] * 60,
    number_2 = context.$match[1] * 3600,
    number_3 = context.$match[1] * 43200,
    number_4 = context.$match[1] * 86400;
    await context.send(`
🦄 ~${utils_1.sp(number_0)} - коинов в секунду 🐬 
🦄 ~${utils_1.sp(number_1)} - коинов в минуту 🐬 
🦄 ~${utils_1.sp(number_2)} - коинов в час 🐬 
🦄 ~${utils_1.sp(number_3)} - коинов в 12 часов 🐬 
🦄 ~${utils_1.sp(number_4)} - коинов в 24 часа 🐬`
    );
});

updates.hear(/(?:rand|рандом) ([0-9]+)/i, async(context) => {
    await context.send(
        `Случайное число в промежутке 1-${ context.$match[1] }
💜 — ${ getRandomInt(context.$match[1]) } — 💜`
    );
});

updates.hear(/^переведи help$/i, async(context) => {
  context.send(`
Образец использование команды «переведи» 
===================== 
Переведи en:text 
🦊 En - язык на какой будет переведёт данный текст 🦊
🐬 Текст - текст который будет переводится. 🐬

Языки:
⚠ en - английский 🐿
⚠ ru - русский 🐿`)
})

updates.hear(/^dark смайлы$/i, async(context) => {
  if (!~admins.indexOf(context.senderId)) {
    return
  } else {
context.send(`
🐬 ¯\\_(ツ)_/¯ 🐬`)
  }
})

//Новое сообщение (не команда)


async function run() {
    await vk.updates.startPolling();
    console.log("Longpoll started");
}

run().catch(console.error);
// Get UnixDate in seconds
function getUnix() {
    return Math.floor(Date.now() / 1000);
}
// Random integer
function getRandomInt(x, y) { 
    return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
}
  
// Random element from array
function getRandomElement(array) { 
    return array[getRandomInt(array.length - 1)]; 
}

function sleep(ms) {
	var start = new Date().getTime()
	while ((new Date().getTime() - start) < ms) {}
	return 1
}

function getRandomItem(array) {
return array[Math.floor(Math.random()*array.length)]
}
