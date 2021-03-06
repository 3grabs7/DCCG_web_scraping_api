const express = require('express');
const router = express.Router();

const validEndpoints = {
	query: (input) => typeof input != 'string',
	limit: (input) => isNaN(input),
	fulltext: (input) => (input != 'true') & (input != 'false'),
};

router.get('/', (req, res) =>
	res.json({ msg: "Here you'll find some scraping being done." })
);

router.get('/ooc', (req, res) =>
	res.json({ msg: 'Get the home page of ooc scraped for custom news.' })
);

const oocWebScraper = require('../ooc_webscraper');
router.get('/ooc/:query', (req, res) => {
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
	console.log(args);

	//* Scrape with provided endpoints and return
	let json = oocWebScraper(args);
	res.status(200).json({ status: 200, response: args });
});

module.exports = router;
