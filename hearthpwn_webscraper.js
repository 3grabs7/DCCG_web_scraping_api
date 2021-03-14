const axios = require('axios');
const cheerio = require('cheerio');

const hearthpwnBaseURL = 'https://www.hearthpwn.com/?page=';

module.exports = function (endpoints) {
	// Convert endpoints to actual values
	const responseMatchesLimit =
		endpoints.filter((e) => e.endpoint === 'limit')[0]?.value ?? 10;
	const includeFullText =
		(endpoints.filter((e) => e.endpoint === 'fulltext')[0]?.value ??
			'false') === 'false'
			? false
			: true;
	console.log(includeFullText);
	const query = endpoints.filter((e) => e.endpoint === 'query')[0]?.value ?? '';

	// Initiate object for response
	const response = { articles: [] };
};
