import { Router } from "express";
import mapExotelRequests from "../controllers/mapExotel.js";
import { sendLimeChatWhatsappTrigger } from "../controllers/limechat.js";
import { getTextBySsid, storeTextInDb } from "../controllers/exotel.js";

const exotelRoutes = Router();


exotelRoutes.get("/message",async(req,res) =>{
    try{
        const {CallSid} = req.query;
        if(!CallSid){
            throw new Error("Required parameter missing");
        };
        const text = await getTextBySsid(CallSid);
        res.setHeader('Content-Type','text/plain').status(200).send(text);
    }catch(err){
        
    }
})
exotelRoutes.get("/",async(req,res) =>{
    try{
       const {CallSid} = req.query;
       if(!CallSid){
        throw new Error("Required parameter missing");
       }
       const data = await mapExotelRequests(req,res);
       if(data.text){
           const storedText = await storeTextInDb(CallSid,data.text);
       }
       if(data.whatsapp){
        sendLimeChatWhatsappTrigger(data.order,data.whatsapp)
       }
       res.sendStatus(200);
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