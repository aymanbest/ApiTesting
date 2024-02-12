// Importing the required modules
const express = require('express'); // Importing the Express module
const fs = require('fs'); // Importing the File System module

// Creating an instance of the Express application
const app = express();

// Setting the port number for the server
const port = 3000;

// Importing the equipe data from the 'equipes.json' file
const equipe = require('./equipes.json');

// Parsing the request body as JSON
app.use(express.json());

// Handling GET requests to '/equipe' endpoint
app.get('/equipe', (req, res) => {
    res.send(equipe); // Sending the equipe data as the response
});

// Handling GET requests to '/equipe/:id' endpoint
app.get('/equipe/:id', (req, res) => {
    const equipeId = parseInt(req.params.id); // Parsing the equipe ID from the request parameters
    const foundEquipe = equipe.find(e => e.id === equipeId); // Finding the equipe with the specified ID

    if (!foundEquipe) {
        res.status(404).send('Equipe not found'); // Sending a 404 response if equipe is not found
        return;
    }

    res.send(foundEquipe); // Sending the found equipe as the response
});

// Handling POST requests to /equipe endpoint
app.post('/equipe', (req, res) => {
    const newEquipes = req.body; // Getting the new equipe data from the request body

    for (const newEquipe of newEquipes) {
        if (!newEquipe.name || !newEquipe.country) {
            res.status(400).send('Invalid equipe data'); // Sending a 400 response if the equipe data is invalid
            return;
        }

        const exists = equipe.some(e => e.id === newEquipe.id || e.name === newEquipe.name); // Checking if an equipe with the same ID or name already exists

        if (exists) {
            res.status(400).send('Equipe with the same name already exists'); // Sending a 400 response if an equipe with the same name already exists
            return;
        }

        newEquipe.id = equipe.length + 1; // Assigning a new ID to the equipe

        equipe.push(newEquipe); // Adding the new equipe to the equipe array
    }

    fs.writeFileSync('./equipes.json', JSON.stringify(equipe, null, 2)); // Writing the updated equipe data to the equipes.json file

    res.status(201).send(`successfully added ${newEquipes.length} equipe(s)`); // Sending a 201 response with the success message
});

// Handling DELETE requests to /equipe/:id endpoint
app.delete('/equipe/:id', (req, res) => {
    const equipeId = parseInt(req.params.id); // Parsing the equipe ID from the request parameters

    const index = equipe.findIndex(e => e.id === equipeId); // Finding the index of the equipe with the specified ID

    if (index === -1) {
        res.status(404).send('Equipe not found'); // Sending a 404 response if equipe is not found
        return;
    }

    const deletedEquipe = equipe.splice(index, 1); // Removing the equipe from the equipe array

    fs.writeFileSync('./equipes.json', JSON.stringify(equipe, null, 2)); // Writing the updated equipe data to the equipes.json file

    res.status(200).send(deletedEquipe); // Sending the deleted equipe as the response
});

// Starting the server and listening on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Logging a message to indicate that the server is running
});