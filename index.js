const express= require("express");
const app= express();
const port=8080;
const Listing= require("./models/listing.js")


// getting-started with mongoose
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/explorer');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



app.get('/about', (req, res) => {
    res.send('About Page');
  });

  app.get("/testListing",async(req,res)=>{
    //creating a sample list
    let sampleListing=new Listing  ({
      title:"Island in Pulau Seribu, Jakarta",
      description:"A beautiful island",
      price:12000,
      location:"Indonesia",

    });
    await Listing.save();
    console.log("sample is saved");
    res.send("successful testing ")
  });
  

app.listen(8080, ()=>{
    console.log("server is running on port 3000")
})