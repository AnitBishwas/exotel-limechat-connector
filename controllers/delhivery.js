import fetch from "node-fetch";

const getTrackingStatusFromDelhivery = async(awb,orderId) =>{
    try{
        const url = `https://track.delhivery.com/api/v1/packages/json/?waybill=${awb}&ref_ids=${orderId}`;
        const request = await fetch(url,{
            headers:{
                'Authorization': `Token ${process.env.DELHIVERY_API}`
            }
        });
        const data = await request.json();
        let formattedData = {
            edd: data.ShipmentData[0].Shipment.ExpectedDeliveryDate,
            delivered:{
               ok: data.ShipmentData[0].Shipment.DeliveryDate ? true : false,
               date: data.ShipmentData[0].Shipment.DeliveryDate 
            },
            attempted_delivery:{
                ok: data.ShipmentData[0].Shipment.FirstAttemptDate ? true : false,
                date: data.ShipmentData[0].Shipment.FirstAttemptDate 
            },
            cancelled_date:{
                ok: data.ShipmentData[0].Shipment.RTOStartedDate ? true : false,
                date: data.ShipmentData[0].Shipment.RTOStartedDate 
            } 
        }
        return formattedData;
    }catch(err){
        throw new Error("Failed to get tracking info from delhivery reason -->" + err.message);
    }
};

export {
    getTrackingStatusFromDelhivery
}