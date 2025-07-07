import { Router } from "express";
import mapExotelRequests from "../controllers/mapExotel.js";

const exotelRoutes = Router();

exotelRoutes.get("/",async(req,res) =>{
    try{
        await mapExotelRequests(req,res);
    }catch(err){
        console.log("Failed to handle request reason -->",err);
        res.status(400).send({
            ok:false
        })
    }
})

exotelRoutes.get("/json",(req,res) =>{
    res.send({
        ok: true
    }).status(200);
});
export default exotelRoutes;