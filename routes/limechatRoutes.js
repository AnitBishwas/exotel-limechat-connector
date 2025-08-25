import { Router } from "express";
import { getOrderStatusByOrderId } from "../controllers/actions.js";
import { getLastFiveOrdersByCustomerPhone } from "../controllers/limechat.js";

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
limeChatRoutes.get("/orders",async(req,res) =>{
    try{
        const phone = req.query.phone;
        if(!phone){
            throw new Error("Required params missing");
        };
        const orders = await getLastFiveOrdersByCustomerPhone(phone);
        res.status(200).send({
            ok: true,
            orders
        })
    }catch(err){
        console.log("Failed to get customer orders by phone for limechat reason --->" + err.message);
        res.status(420).send({
            ok: false
        })
    }
})
export default limeChatRoutes;

