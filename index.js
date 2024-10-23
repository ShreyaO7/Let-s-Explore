const express= require("express");
const app= express();
const path=require("path");
const port=3000;
const Listing= require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const Review= require("./models/review.js");


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
app.get("/listing", wrapAsync(async(req,res)=>{
  const allListings= await Listing.find({});
  res.render('listings/index.ejs',{allListings});
}));

//New route
app.get("/listing/new",(req,res)=>{
  res.render("listings/new.ejs");

});

//show route
app.get("/listing/:id",  wrapAsync(async (req, res) => {
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
}));


//Create Route
app.post("/listing", wrapAsync(async(req, res, next) => {   // wrapAsync is handling errors as try-catch
  let result= listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400, result.error);
  }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  })
);


//Edit Route
app.get("/listing/:id/edit",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Delete Route
app.delete("/listing/:id",  wrapAsync(async (req, res) => {
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
}));
app.get("/root",async(req,res)=>{
  res.send("hi welcome to my website!");
});

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
});

app.use((err, req,res,next)=>{     // async error handler
  let { statusCode=500, message="something went wrong" }= err;   //default value set 
  res.render("error.ejs");
  // res.status(statusCode).send(message);
});



// Update Route
app.put("/listing/:id", wrapAsync(async (req, res) => {
  if(!req.body.Listing){
    throw new ExpressError(400,"send valid data for listing");
  }
  let { id } = req.params;
  let listing1=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing`);
}));
app.get("/",(req,res)=>{
  res.send("home page")
})

//reviews
//Post route
app.post("/listing/:id/reviews",async(req,res)=>{
  let listing= await Listing.findById(req.params.id);
  let newReview= new Review(req.body.review);   //new review is created
  listing.reviews.push(newReview);   //hr listing me reviews array bhi hoga aur usme newReview add krengy
  
  await newReview.save();
  await listing.save();

  console.log("new review saved");
  res.send("new Review saved");
});

app.listen('3000',()=>{
  console.log("App is listening at 3000")
});