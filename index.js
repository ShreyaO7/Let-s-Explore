const express= require("express");
const app= express();
const path=require("path");
const port=3000;
const Listing= require("./models/listing.js")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");



// getting-started with mongoose
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/explorer');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //data getting parsed

//index route
app.get("/listings",async(req,res)=>{
  const allListings= await Listing.find({});
  res.render('/listings/index.ejs',{allListings});
});

//New route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");

});

//show route
app.get("/listings/:id", async(req,res)=>{
  let{id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
});


//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});


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