const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json()); // This is for parsing the JSON body

app.use('/fhir', async (req, res) => {
    try {
        const fhirServerUrl = "https://fhirdb-monash-secondary.fhir-web-apps.cloud.edu.au/fhir";

        const endpoint = req.originalUrl.replace(/^\/fhir/, '');
        const finalUrl = `${fhirServerUrl}${endpoint}`;

        // Forward the request
        const response = await axios({
            method: req.method,
            url: finalUrl,
            headers: {
                ...req.headers,
                host: undefined,
                accept: 'application/fhir+json',
            },
            data: req.body
        });
        res.json(response.data);

    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(error.response?.status || 500).json(error.response?.data || {});
    }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
