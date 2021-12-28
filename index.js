require('dotenv').config();
const cron = require('node-cron');
const Messenger = require('./lib/messenger.js');

async function leet() {
	const message = 'leet';
	const chatId = process.env.FB_CHAT_ID;

	const messenger = new Messenger();
	await messenger.sendMessage(message, chatId);
}

const cronOptions = {
	scheduled: true,
	timezone: process.env.CRON_TIMEZONE || 'Europe/Oslo',
};

// Schedule leet to run every day at 13:37:00
cron.schedule(
	'37 13 * * *',
	() => {
		console.log('Running leet');
		leet();
	},
	cronOptions
);
