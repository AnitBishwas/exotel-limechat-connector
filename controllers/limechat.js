import fetch from "node-fetch"
import { getCustomerIdByPhoneNumber, getLastFiverOrdersByCustomerId } from "./shopify.js";

const sendLimeChatWhatsappTrigger = async(calSid,phone,status) =>{
    try{
        let event = null;
        switch(status){
            case 'order_cod_refund_not_eligible' : 
                event = 'refund_policy'
            break;
            case 'order_status_refund_not_eligible' :
                event = 'refund_policy'
            break;
            case 'website_offer' :
                event = 'website_offer'
            break;
            case 'store_locator' :
                event = 'store_locator'
            break;
            case 'collaboration' :
                event = 'collaboration'
            break;
            case 'distibutor' :
                event = 'distibutor'
            break;
            case 'bulk_order' :
                event = 'bulk_order'
            break;
        }
        let requestUrl = 'https://flow-builder.limechat.ai/api/v1/cvf-events';
        let requestBody = {
            distinct_id: calSid,
            phone: phone,
            event: event,
            data:{} 
        };
        const request = await fetch(requestUrl,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-limechat-uat': process.env.LIME_CHAT_API,
                'x-fb-account-id': process.env.LIME_ACCOUNT_ID
            },
            body: JSON.stringify(requestBody)
        });
        const data = await request.json();
        console.log('request sent to limechat');
    }catch(err){

    }
};

/**
 * Get last 5 orders for customer by phone
 * @param {string} phone - registered cutomer phone number
 * @returns {array} orders - list of recent 5 orders created by customer
 */
const getLastFiveOrdersByCustomerPhone = async (phone) =>{
    try{
        const customerId = await getCustomerIdByPhoneNumber(phone);
        if(!customerId){
            throw new Error("No customer found with the associated phone number");
        };
        const orders = await getLastFiverOrdersByCustomerId(customerId);
        return orders;
    }catch(err){
        throw new Error("Failed to get last five orders by customer phone reason -->" + err.message);
    }
}
export {sendLimeChatWhatsappTrigger,getLastFiveOrdersByCustomerPhone};