const axios = require('axios');
const cheerio = require('cheerio');

const oocBaseURL = 'https://outof.cards/page=';

module.exports = async (responseMatchesLimit, query) => {
	let response = { articles: [] };
	while (response.articles.length < responseMatchesLimit) {
		let oocCurrentScrapeURL = `${oocBaseURL}${response.articles.length + 1}`;
		axios.get(oocCurrentScrapeURL);
	}

	return response;
};
