// Import required modules
const express = require('express');
const os = require('os');
const helmet = require('helmet'); // For basic security improvements
const bodyParser = require('body-parser');
const path = require('path');
const conversor = require('./convert');
const config = require('./config/system-life');

const app = express();

// Use Helmet for basic security
app.use(helmet());

// Middleware for health checks
app.use(config.middlewares.healthMid);

// Router configuration
app.use('/', config.routers);

// Body parser middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route to convert Fahrenheit to Celsius
app.get('/fahrenheit/:valor/celsius', (req, res) => {
    const valor = parseFloat(req.params.valor);
    if (isNaN(valor)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const celsius = conversor.fahrenheitCelsius(valor);
    res.json({ celsius, maquina: os.hostname() });
});

// Route to convert Celsius to Fahrenheit
app.get('/celsius/:valor/fahrenheit', (req, res) => {
    const valor = parseFloat(req.params.valor);
    if (isNaN(valor)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const fahrenheit = conversor.celsiusFahrenheit(valor);
    res.json({ fahrenheit, maquina: os.hostname() });
});

// Route to render the index page
app.get('/', (req, res) => {
    res.render('index', { valorConvertido: '', maquina: os.hostname() });
});

// Route to handle form submissions for temperature conversion
app.post('/', (req, res) => {
    let resultado = '';

    if (req.body.valorRef) {
        const valorRef = parseFloat(req.body.valorRef);
        if (isNaN(valorRef)) {
            return res.render('index', { valorConvertido: 'Invalid input', maquina: os.hostname() });
        }
        if (req.body.selectTemp == 1) {
            resultado = conversor.celsiusFahrenheit(valorRef);
        } else {
            resultado = conversor.fahrenheitCelsius(valorRef);
        }
    }

    res.render('index', { valorConvertido: resultado, maquina: os.hostname() });
});

// Start the server on the specified port or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});