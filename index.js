const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {});

app.use('/api', require('./routes/api'));

const port = process.env.PORT ?? 4455;
app.listen(port, () =>
	console.log(`It's all happening here -> http://localhost:${port}/`)
);
