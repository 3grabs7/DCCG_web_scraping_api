const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
	res.json({ msg: "Here you'll find some scraping being done." })
);

router.get('/ooc', (req, res) =>
	res.json({ msg: 'Get the home page scraped for custom news.' })
);

const oocWebScraper = require('../ooc_webscraper');
router.get('/ooc/:query', (req, res) => {
	const args = req.params.query.split('&').map((arg) => {
		const endpoint = arg.split('=')[0];
		const value = arg.split('=')[1];
		return { endpoint, value };
	});
	console.log(args);
	let json = oocWebScraper(...args);

	res.json(args);
});

module.exports = router;
