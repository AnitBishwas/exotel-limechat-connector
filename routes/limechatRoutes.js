import { Router } from "express";
import { getOrderStatusByOrderId } from "../controllers/actions.js";

const limeChatRoutes = Router();

limeChatRoutes.get("/status",async(req,res) =>{
    try{
        const {orderId} = req.query;
        const orderStatus = await getOrderStatusByOrderId(orderId);
        if(!orderStatus){
            throw new Error("Failed to get order status")
        };
        res.status(200).send({
            ok: true,
            message: orderStatus
        })
    }catch(err){
        res.status(420).send({
            ok: false
        })
    }
});

export default limeChatRoutes;
