// .env setup
require('dotenv').config();

// express setup
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.static('public'));

// pug setup
const pug = require('pug');
app.set('views', './views');
app.set('view engine', 'pug');

// db setup
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
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
  res.render('index');
});

// search
app.get(['/search/:name', '/search?'], (req, res) => {
  const query = req.query.query || req.params.name
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
  Search.find({})
      .sort({date: -1})
      .exec((err, docs) =>{
    const result = docs.map(doc => {return { query: doc.query, date: doc.date}});
    res.json(result);
  })
})

// 404
app.all('/(*+)', (req, res) =>  {
  res.render('index', {wrongRoute: true});
})

app.listen(port, () => { console.log(`Server is up and listening on port ${port}`);});