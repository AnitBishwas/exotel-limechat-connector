import fetch from "node-fetch";

/**
 * Generate auth token for shiprocket
 * @returns {string} authtoken
 */
const generateAuthToken = async () =>{
    try{
        const url = `https://apiv2.shiprocket.in/v1/external/auth/login`;
        const request = await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASS
            })
        });
        const data = await request.json();
        if(!data?.token){
            throw new Error("Failed to get auth token from shiprocket request");
        };
        return data.token;
    }catch(err){
        throw new Error("Failed to generate shiprocket auth token reason --> " + err.message);
    }
};

/**
 * Get tracking status from shiprocket
 * @param {string} orderId - shopify order id
 * @returns {object} - tracking object
 */
const getTrackingStatusFromShipRocket = async(orderId) =>{
    try{
        if(!orderId){
            throw new Error("Order ID is required to fetch tracking status")
        }
        const token = await generateAuthToken();
        const url = `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`;
        const request = await fetch(url,{
            method:'GET',
            headers:{
                'Authorization' : `Bearer ${token}`
            }
        });
        const data = await request.json();
        let formattedData = {
            edd : data[0].tracking_data.shipment_track[0].edd,
            delivered: {
                ok: data[0].tracking_data.shipment_track[0].delivered_date.length > 0,
                date: data[0].tracking_data.shipment_track[0].delivered_date 
            },
            attempted_delivery : {
                ok: data[0].tracking_data.shipment_track_activities.find(el => el['activity'] == 'PENDING FOR RE-ATTEMPT')?.date ? true : false,
                date : data[0].tracking_data.shipment_track_activities.find(el => el['activity'] == 'PENDING FOR RE-ATTEMPT')?.date || null,
            },
            cancelled_date : {
                ok: data[0].tracking_data.shipment_track_activities.find(el => el['activity'] == 'CANCELLED')?.date ? true : false,
                date: data[0].tracking_data.shipment_track_activities.find(el => el['activity'] == 'CANCELLED')?.date 
            },
            rto_date : {
                ok: data[0].tracking_data.shipment_track_activities.find(el => el['activity'] == 'Return To Origin')?.date ? true : false,
                date: data[0].tracking_data.shipment_track_activities.find(el => el['activity'] == 'Return To Origin')?.date 
            },
        };
        return formattedData;
    }catch(err){
        throw new Error("Failed to get tracking status from shiprocket reason --> " + err.message);
    }
};
export {
    getTrackingStatusFromShipRocket
}