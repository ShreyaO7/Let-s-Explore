const mongoose=require("mongoose");
const review = require("./review");
const schema= mongoose.Schema;

const listingSchema= new schema({
    title:{
        type:String,
        required:true,
    },
    image: {
        filename: { type: String },
        url: { type: String, required: true }
      },
    description:String,
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review",
        },
    ], 
});
 const Listing=mongoose.model("Listing",listingSchema);
 module.exports= Listing;