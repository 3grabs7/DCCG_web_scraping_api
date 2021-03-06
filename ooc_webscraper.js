const axios = require('axios');
const cheerio = require('cheerio');

const oocBaseURL = 'https://outof.cards/?page=';

module.exports = async (endpoints) => {
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

	// Loop through pages until limit is met
	let pageCounter = 1;
	while (response.articles.length < responseMatchesLimit) {
		// Get html text from page to scrape
		let oocCurrentScrapeURL = `${oocBaseURL}${pageCounter}`;
		const { data } = await axios.get(oocCurrentScrapeURL);
		const $ = cheerio.load(data);

		// Loop through html elements
		$('.article-excerpt').each(async (index, element) => {
			const $element = $(element);

			const game = $element
				.find('.article-details a')
				.attr('href')
				.replace(/\//g, '');
			console.log(game);

			// Check for specific game || Hardcoded for hearthstone for now
			if (game === /* Variable for chosen game goes here --> */ 'hearthstone') {
				const title = $element.find('.article-details h1 a').text();
				const url = `https://outof.cards/${$element
					.find('.article-details h1 a')
					.attr('href')
					.replace('https:/', '')}`;
				const thumbnail = $element.find('.post-image').attr('src');

				let fullText = 'Text body omitted.';
				// If fulltext's included get full text from article
				if (includeFullText) {
					fullText = await getFullTextAsBody(url);
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

// Method for getting full article text
async function getFullTextAsBody(url) {
	let fullText = '';

	const { data } = await axios.get(url);
	const $ = cheerio.load(data);

	$('#article-sweet').each((index, element) => {
		const $element = $(element);
		fullText += $element.find('.article-body p').text() + '\n';
	});

	console.log(fullText);

	return fullText;
}
