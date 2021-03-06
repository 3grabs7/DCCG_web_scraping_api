const axios = require('axios');
const cheerio = require('cheerio');

const oocBaseURL = 'https://outof.cards/?page=';

module.exports = async (endpoints) => {
	//* Default values for now. Endpoints is an array of objects with endpoint/value properties
	//* Needs another approach to extract
	const responseMatchesLimit = endpoints.limit ?? 5; //* 1 for now, SET TO 10 WHEN DONE!
	const includeFullText = endpoints.fulltext ?? false;
	const query = endpoints.query ?? '';

	const response = { articles: [] };

	for (let i = 0; i < responseMatchesLimit; i++) {
		let oocCurrentScrapeURL = `${oocBaseURL}${i + 1}`;
		const { data } = await axios.get(oocCurrentScrapeURL);
		const $ = cheerio.load(data);

		$('.article-excerpt').each((index, element) => {
			const $element = $(element);
			const title = $element.find('.article-details h1 a').text(); // article-details h1 a
			const url = `https:/${$element
				.find('.article-details h1 a')
				.attr('href')
				.replace('https:/', '')}`; // article-details h1 a href
			const thumbnail = $element.find('.post-image').attr('src'); // article-thumb a href
			if (includeFullText) {
				const fullText = $elment.find();
			}
			const article = {
				title,
				url,
				thumbnail,
			};
			response.articles.push(article);
		});
	}

	return response;
};
