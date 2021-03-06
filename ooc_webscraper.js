const axios = require('axios');
const cheerio = require('cheerio');

const oocBaseURL = 'https://outof.cards/?page=';

module.exports = async (endpoints) => {
	// Convert endpoints to actual values
	const responseMatchesLimit =
		endpoints.filter((e) => e.endpoint === 'limit')[0]?.value ?? 10;
	const includeFullText =
		endpoints.filter((e) => e.endpoint === 'fulltext')[0]?.value ??
		'false' === false
			? false
			: true;
	const query = endpoints.filter((e) => e.endpoint === 'query')[0]?.value ?? '';

	// Initiate object for response
	const response = { articles: [] };

	// Loop through pages until limit is met
	let pageCounter = 1;
	while (response.articles.length < responseMatchesLimit) {
		// Get html from page to scrape
		let oocCurrentScrapeURL = `${oocBaseURL}${pageCounter}`;
		const { data } = await axios.get(oocCurrentScrapeURL);
		const $ = cheerio.load(data);

		// Loop through html elements
		$('.article-excerpt').each((index, element) => {
			const $element = $(element);
			// Check for specific game || Hardcoded for hearthstone for now
			const game = $element
				.find('.article-details a')
				.attr('href')
				.replace(/\//g, '');
			console.log(game);

			if (game === /* Variable for chosen game goes here --> */ 'hearthstone') {
				const title = $element.find('.article-details h1 a').text();
				const url = `https:/${$element
					.find('.article-details h1 a')
					.attr('href')
					.replace('https:/', '')}`;
				const thumbnail = $element.find('.post-image').attr('src');
				let fullText = '';

				if (includeFullText) {
					const fullText = $element.find();
				}

				const article = {
					title,
					url,
					thumbnail,
					fullText,
				};
				if (response.articles.length >= responseMatchesLimit) {
					return response;
				}
				response.articles.push(article);
			}
		});
		pageCounter++;
	}

	return response;
};
