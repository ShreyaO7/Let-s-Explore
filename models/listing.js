const mongoose=require("mongoose");
const schema= mongoose.Schema;

const listingSchema= new schema({
    title:{
        type:String,
        required:true,
    },
    image:{
        type:{
            filename:String,
            url:String
        },
        required:true,
    },
    description:String,
    price:Number,
    location:String,
});
 const Listing=mongoose.model("Listing",listingSchema);
 module.exports= Listing;