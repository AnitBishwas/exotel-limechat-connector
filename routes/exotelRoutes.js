import { Router } from "express";
import mapExotelRequests from "../controllers/mapExotel.js";
import { sendLimeChatWhatsappTrigger } from "../controllers/limechat.js";

const exotelRoutes = Router();

exotelRoutes.get("/",async(req,res) =>{
    try{
       const data = await mapExotelRequests(req,res);
       if(data.whatsapp){
        sendLimeChatWhatsappTrigger(data.order,data.whatsapp)
       }
       res.setHeader('Content-Type','text/plain').status(200).send(data.text);
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