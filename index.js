const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: 'https://singular-cat-d02c41.netlify.app',
  methods: ['GET', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// mongodb+srv://<username>:<password>@cluster0.s4ykc77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// sahareior11   PFWhO8u9xqzDZ5IA

const uri = "mongodb+srv://sahareior11:PFWhO8u9xqzDZ5IA@cluster0.s4ykc77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('Website');
    const Seo = db.collection("seo");

    // Route to fetch SEO datagg
    app.get('/seo', async (req, res) => {
      try {
        const data = await Seo.find().toArray();
        res.send(data);
       
      } catch (err) {
        console.error('Error fetching SEO data:', err);
        res.status(500).send('Error fetching SEO data.');
      }
    });

    // Route to update the status
    app.patch('/update-status', async (req, res) => {
      try {
        const { id } = req.body;
        const query = { _id: new ObjectId(id) };
        const update = { $set: { status: 'done' } }; // Update status to 'done'
    
        const result = await Seo.updateOne(query, update);
    
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'Document not found' });
        }
    
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred' });
      }
    });
    

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer().catch(console.dir);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
