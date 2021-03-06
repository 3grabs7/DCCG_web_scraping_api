const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {});

app.use('/scraping', require('./routes/scraping'));

const port = process.env.PORT ?? 4455;
app.listen(port, () =>
	console.log(`It's all happening here -> http://localhost:${port}`)
);
