const express= require("express");
const app= express();
const path=require("path");
const port=3000;
const Listing= require("./models/listing.js")



// getting-started with mongoose
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/explorer');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.get("/listings",async(req,res)=>{
  const allListings=await Listing.find({});
  res.render("/listings/index.ejs",{allListings});
})

app.get('/about', (req, res) => {
    res.send('About Page');
  });

  // app.get("/testListing", async(req,res)=>{
  //   let sampleListing=new Listing({
  //     title:"MY villa",
  //     description:"BY the beach",
  //     price:5000,
  //     location:"goa",
  //   });
  //   await sampleListing.save();
  //   console.log("sample is saved");
  //   res.send("successful testing")
  // });

  

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})