const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const uri = "mongodb+srv://<username>:<password>@cluster0.xdx2hpf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    let isConnected = false;

    app.get('/turn/:state', async (req, res) => {
      const state = req.params.state
        if (state == "off") {
            await client.close();
            isConnected = false;
            res.send('Connection is now OFF');
        } else {
            await client.connect();
            isConnected = true;
            res.send('Connection is now ON');
        }
    });

    const database = client.db('Express');
    const collection = database.collection('Equipes');

    app.get('/equipe/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const equipe = await collection.findOne({ id: id });
            res.send(equipe);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving team');
        }
    });

    app.post('/equipe', async (req, res) => {
      const equipere = req.body
      try{
        const equipe = await collection.insertOne(equipere)
        res.status(200).send(equipe);
      } catch  (err) {
        console.error(err);
        res.status(500).send('Error retrieving team');
    }
      
  });

app.delete('/equipe/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await collection.deleteOne({ id: id });
    if (result.deletedCount === 1) {
      res.status(200).send('Team deleted successfully\n'+ result);
    } else {
      res.status(404).send('Team not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting team');
  }
});

app.put('/equipe/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedEquipe = req.body;
  try {
    const result = await collection.replaceOne({id},updatedEquipe);
    if (result.modifiedCount === 1) {
      res.status(200).send('Team updated successfully\n'+ result);
    } else {
      res.status(404).send('Team not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating team');
  }
});



  

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();
