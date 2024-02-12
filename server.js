const express = require('express');
const fs = require('fs'); 
const app = express();
const port = 3000;
const joueurs = require('./joueur.json');
const equipes = require('./equipes.json');

app.use(express.json());


app.post('/joueur', (req, res) => {
    joueurs.push(req.body);
    fs.writeFileSync('joueur.json', JSON.stringify(joueurs));
    res.status(201).send(joueurs);
});


app.get('/joueur/:id', (req, res) => {
    const joueur = joueurs.find(j => j.id == req.params.id);
    res.send(joueur);
});

app.put('/joueur/:id', (req, res) => {
    const index = joueurs.findIndex(j => j.id == req.params.id);
    joueurs[index] = req.body;
    fs.writeFileSync('joueur.json', JSON.stringify(joueurs));
    res.send(req.body);
});


app.delete('/joueur/:id', (req, res) => {
    const filteredJoueurs = joueurs.filter(j => j.id != req.params.id);
    fs.writeFileSync('joueur.json', JSON.stringify(filteredJoueurs));
    res.send({ message: 'Joueur deleted' });
});


app.get('/equipe/:id/joueurs', (req, res) => {
    const joueurs = JSON.parse(fs.readFileSync('joueur.json'));
    const joueursInEquipe = joueurs.filter(j => j.idEquipe == req.params.id);
    res.send(joueursInEquipe);
});

app.get('/joueur/:id/equipe', (req, res) => {
    const joueur = joueurs.find(j => j.id == req.params.id);
    const equipe = equipes.find(e => e.id == joueur.idEquipe);
    res.send(equipe);
});


app.get('/joueur/search/:name', (req, res) => {
    const joueur = joueurs.find(j => j.nom == req.params.name);
    res.send(joueur);
});


app.listen(port, () => {
    console.log('Server is running on port 3000');
});