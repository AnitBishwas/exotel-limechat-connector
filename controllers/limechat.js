import fetch from "node-fetch"

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
export {sendLimeChatWhatsappTrigger};