import fetch from "node-fetch"

const sendLimeChatWhatsappTrigger = async(order,status) =>{
    try{
        console.log('sending limechat trigger')
        let event = null;
        if(status == 'order_cod_refund_not_eligible'){
            event = 'refund_policy'
        }else if(status == 'order_status_refund_not_eligible'){
            event = 'refund_policy'
        };
        let customerPhone = order.customer.defaultPhoneNumber.phoneNumber;
        let requestUrl = 'https://flow-builder.limechat.ai/api/v1/cvf-events';
        let requestBody = {
            distinct_id: customerPhone,
            phone: customerPhone,
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
        console.log(customerPhone);
        const data = await request.json();
        console.log(data);
    }catch(err){

    }
};
export {sendLimeChatWhatsappTrigger};