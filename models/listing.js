const mongoose=require("mongoose");
const schema= mongoose.Schema;

const listingSchema= new schema({
    title:{
        type:String,
        required:true,
    },
    image:{
        // type:{
        //     filename:String,
        //     url:String
        // },
        type:String,
        required:true,
    },
    description:String,
    price:Number,
    location:String,
    country:String,
});
 const Listing=mongoose.model("Listing",listingSchema);
 module.exports= Listing;