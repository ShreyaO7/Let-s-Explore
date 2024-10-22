const express= require("express");
const app= express();
const path=require("path");
const port=3000;
const Listing= require("./models/listing.js")
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");


// getting-started with mongoose
const mongoose = require('mongoose');

main().then(()=>{
  console.log("DB is connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/explorer');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.use(express.urlencoded({extended:true})); //data getting parsed

//index route
app.get("/listing",async(req,res)=>{
  const allListings= await Listing.find({});
  res.render('listings/index.ejs',{allListings});
});

//New route
app.get("/listing/new",(req,res)=>{
  res.render("listings/new.ejs");

});

//show route
app.get("/listing/:id", async (req, res) => {
  try {
    let { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid Listing ID format");
      return res.status(400).send("Invalid Listing ID");
    }
    const listing = await Listing.findById(id);
    
    if (!listing) {
      console.error("Listing not found for ID:", id);
      return res.status(404).send("Listing not found");
    }

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error("Error in Show Route:", err);
    res.status(500).send("Server Error");
  }
});


//Create Route
app.post("/listing", async (req, res, next) => {
  try{
    console.log(req.body.listing)
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  }
  catch(err){
    next(err);
  }
});


//Edit Route
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Delete Route
app.delete("/listing/:id", async (req, res) => {
  try {
    let { id } = req.params;
     
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Listing ID");
    }

    let deletedListing = await Listing.findByIdAndDelete(id); // Delete the listing.
    if (!deletedListing) {
      return res.status(404).send("Listing not found"); // Handle if no listing is found.
    }
    console.log(deletedListing); // Log the deleted listing.
    res.redirect("/listing");   // Redirect to the listings page (assuming it shows all listings).
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error"); // Handle any server errors.
  }
});
app.get("/root",async(req,res)=>{
  res.send("hi welcome to my website!");
});

app.use((err, req,res,next)=>{     // async error handler
  let{statusCode, message}=err;
  res.status(statusCode).send(message);
});



// Update Route
app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let listing1=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing`);
});
app.get("/",(req,res)=>{
  res.send("home page")
})

app.listen('3000',()=>{
  console.log("App is listening at 3000")
})