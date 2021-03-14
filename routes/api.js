const express = require('express');
const router = express.Router();

//* Endpoints/types reference
const validEndpoints = {
	query: (input) => typeof input != 'string',
	limit: (input) => isNaN(input),
	fulltext: (input) => (input != 'true') & (input != 'false'),
};

//* Supported games
const validGamesValue = [
	'hearthstone',
	'mythgard',
	'artifact',
	'legends-of-runeterra',
];

router.get('/', (req, res) =>
	res.json({ msg: 'Available pages to scrape from as for now : *OOC*, ' })
);

router.get('/all', (req, res) => {
	res.json({ msg: 'Scraping will be done for all available sites' });
});

//* ======================
//* === OOC Web Scrape ===
//* ======================

const oocWebScraper = require('../ooc_webscraper');

router.get('/ooc', (req, res) =>
	res.json({ msg: 'Get the home page of ooc scraped for custom news.' })
);

router.get('/ooc/:query', async (req, res) => {
	let requestOK = true;

	//* Break out endpoints
	const args = req.params.query.split('&').map((arg) => {
		const endpoint = arg.split('=')[0];
		const value = arg.split('=')[1];
		return { endpoint, value };
	});

	//* Check validity of endpoints
	args.forEach((arg) => {
		if (requestOK && !validEndpoints[arg.endpoint]) {
			res
				.status(400)
				.json({ status: 400, msg: `Endpoint '${arg.endpoint}' is invalid.` });
			requestOK = false;
			return;
		}
		if (requestOK && validEndpoints[arg.endpoint](arg.value)) {
			res.status(400).json({
				status: 400,
				msg: `Value '${arg.value}' for endpoint '${arg.endpoint}' is invalid.`,
			});
			requestOK = false;
			return;
		}
	});
	if (!requestOK) {
		return;
	}

	//* Scrape with provided endpoints and return
	let jsonResponse = await oocWebScraper(args);
	res.status(200).json({ status: 200, response: jsonResponse });
});

//* ============================
//* === HearthPwn Web Scrape ===
//* ============================

const hearthpwnWebScraper = require('../hearthpwn_webscraper');

router.get('/hearthpwn', (req, res) =>
	res.json({ msg: 'Get the home page of hearthpwn scraped for custom news.' })
);

router.get('/hearthpwn/:query', async (req, res) => {
	let requestOK = true;

	//* Break out endpoints
	const args = req.params.query.split('&').map((arg) => {
		const endpoint = arg.split('=')[0];
		const value = arg.split('=')[1];
		return { endpoint, value };
	});

	//* Check validity of endpoints
	args.forEach((arg) => {
		if (requestOK && !validEndpoints[arg.endpoint]) {
			res
				.status(400)
				.json({ status: 400, msg: `Endpoint '${arg.endpoint}' is invalid.` });
			requestOK = false;
			return;
		}
		if (requestOK && validEndpoints[arg.endpoint](arg.value)) {
			res.status(400).json({
				status: 400,
				msg: `Value '${arg.value}' for endpoint '${arg.endpoint}' is invalid.`,
			});
			requestOK = false;
			return;
		}
	});
	if (!requestOK) {
		return;
	}

	//* Scrape with provided endpoints and return
	let jsonResponse = await hearthpwnWebScraper(args);
	res.status(200).json({ status: 200, response: jsonResponse });
});
module.exports = router;
