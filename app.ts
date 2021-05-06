import * as cfg from './config';
import Discord from 'discord.js';
import Collection from '@discordjs/collection';
import EventEmitter from 'events';
import axios from 'axios';
import { Logger } from './src/Logger';
import { randStr } from './src/randStr';
import chalk from 'chalk';
import { print } from './src/print';

type UserID = string;
interface PrinterMessageData {
	ref: string;
	userId: string;
	userTag: string;
	message: string;
	messageId: string;
	date: Date;
	msgObject: Discord.Message;
};

const bot = new Discord.Client();
const messageQueue: Collection<UserID, PrinterMessageData> = new Collection();

const printerEvents = new EventEmitter();

let lastMessageUserId: string;

function _startQueueRoutine() {
	const queueRoutine = setInterval(() => {
		if (!messageQueue.first()) return;

		const msgs = (() => {
			let broken = false;
			let lastUser: any = null;
			let msgs: PrinterMessageData[] = []
			messageQueue.forEach((msg, key, map) => {
				if (broken) return;
				
				if (msg.userId !== lastUser) {
					if (lastUser !== null) broken = true;
					else lastUser = msg.userId;
				}

				msgs.push(msg);
			});
			return msgs;
		})();

		const m0 = msgs[0];
		const tag = msgs[0].userTag;
		
		const messageArray = msgs.map(msg => msg.message);
		const rawMessage = messageArray.join('\n');

		const pre = (m0.userId == lastMessageUserId ? "" : `@${tag}:\n`);
		const message = encodeURIComponent(`${pre}${rawMessage}`);

		print(message).then(async () => {

			lastMessageUserId = msgs[0].userId

			msgs.map(msg => msg.msgObject.react(cfg.reactionEmoteSuccess));

			msgs.map((msg) => Logger.message(chalk.gray(`@${msg?.userTag}`), chalk.yellow(">"), msg?.message))
			msgs.map(msg => messageQueue.delete(msg?.ref ? msg.ref : ""))
		}).catch(dat => {
			msgs.map(msg => msg.msgObject.react(cfg.reactionEmoteFail));
			msgs.map(msg => messageQueue.delete(msg?.ref ? msg.ref : ""))
			Logger.error('Could not print a message...');
		})
	}, cfg.interval);
}

bot.on('ready', () => {
	Logger.discord("Successfully logged into discord as", bot.user?.tag);
	_startQueueRoutine();
});

bot.on('message', (msg) => {
	if (msg.mentions.users.first()?.id == bot.user?.id){
		const message = msg.cleanContent.split(' ').slice(1).join(" ");
		const ref = randStr(128);
	
		const obj: PrinterMessageData = {
			userId: msg.author.id,
			userTag: msg.author.tag,
			message,
			messageId: msg.id,
			date: new Date(),
			ref,
			msgObject: msg
		}
	
		messageQueue.set(ref, obj);
	}
});

bot.login(cfg.discordToken);