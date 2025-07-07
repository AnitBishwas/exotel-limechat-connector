import { getOrderByPhoneNumber } from "./shopify.js";
const mapExotelRequests = async(req, res) => {
  try {
    const appId = req.query.appId;
    if (!appId) {
      throw new Error("No App Id provided");
    }
    let currentMapping = [
      {
        key: 1,
        value: "Order_status_phone",
      },
      {
        key: 2,
        value: "order_status_id",
      },
    ];
    const currentCase = currentMapping.find(({key}) => key == appId);
    if(!currentCase){
        throw new Error("No corresponding case found for the key")
    };
    switch(currentCase){
        case "Order_status_phone" :
            await getOrderByPhoneNumber(req.query.phone);
        break;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
 export default mapExotelRequests;