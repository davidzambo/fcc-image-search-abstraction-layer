// .env setup
require('dotenv').config();

// express setup
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// db setup
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const Schema = mongoose.Schema;
const SearchSchema = new Schema({
  query: String,
  date: { type: Date, default: new Date()}
});
const Search = mongoose.model('SearchModel', SearchSchema)

// google image search engine setup
const engineID = process.env.ENGINE_ID;
const apiKey = process.env.API_KEY;
const GoogleImages = require('google-images');
const searchClient = new GoogleImages(engineID, apiKey);

app.all('/', (req, res) => {
  res.send('Description');
});

// search
app.get('/search/:name', (req, res) => {
  const query = req.params.name
  // store the search query
  const newSearch = new Search({query: query})
  try {
    newSearch.save();
  } catch (e){
    console.log('Error to store in DB: ' + e);
  }
  // initialize offset query parameter
  const page = req.query.offset || 1;
  
  // fetch data from google
  searchClient.search(query, { page: page })
    // return results
    .then(images => {
      let result = images.map(img => {
        return {
          context: img.parentPage,
          thumbnail: img.thumbnail.url,
          url: img.url,
          snippet: img.description,
        }
      });
      res.json(result);
    })
    // return error message
    .catch( error => { 
      console.log('Whoops:' + error);
      res.json({
        message: `Whoops! Something went wrong...`, 
        error: `${error}`
      });
    });
});

// list searchs
app.get('/latest', (req, res) => {
  Search.find({}, (err, docs) =>{
    const result = docs.map(doc => {return { query: doc.query, date: doc.date}});
    res.json(result);
  })
})

app.listen(port, () => { console.log(`Server is up and listening on port ${port}`);});