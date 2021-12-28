const puppeteer = require('puppeteer');
const login = require('facebook-chat-api');

class Messenger {
	constructor(email, password) {
		this.email = email || process.env.FB_EMAIL;
		this.password = password || process.env.FB_PASSWORD;
	}

	async getAppState() {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		page.waitForNavigation({ waitUntil: 'networkidle2' });
		await page.goto('https://www.facebook.com/');
		await page.waitForSelector('#email');
		// Accept cookies
		await page.click('button[data-cookiebanner="accept_button"]');
		await page.waitForTimeout(500);
		// Login
		await page.$eval('#email', (el, email) => (el.value = email), this.email);
		await page.$eval('#pass', (el, password) => (el.value = password), this.password);
		await page.click('button[name="login"]');
		await page.waitForSelector('div[role=feed]');
		// Get cookies
		const cookies = await page.cookies();
		await browser.close();
		return cookies.map(({ name: key, ...rest }) => ({ key, ...rest }));
	}

	async login() {
		const appState = await this.getAppState();
		return new Promise((resolve, reject) => {
			login({ appState }, (err, api) => {
				if (err) return reject(err);
				resolve(api);
			});
		});
	}

	async sendMessage(message, recipientId) {
		try {
			const api = await this.login();
			api.sendMessage(message, recipientId);
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = Messenger;
