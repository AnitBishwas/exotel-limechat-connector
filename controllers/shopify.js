import fetch from "node-fetch";

/*
    @params
        orderId: Number!
*/
const getOrderDetails = async (orderId) => {
  try {
    if(!orderId){
        throw new Error("Order Id is a required argument");
    };
    let url = process.env.SHOP_URL + "/admin/api/2025-04/graphql.json";
    const query =  `query{
        orders(first:1,query:"name:#${orderId}"){
            edges{
                node{
                    id
                    createdAt
                    customer{
                        displayName
                    }
                    returnStatus
                    closed
                }
            }
        }
    }`; 
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_SECRET_TOKEN,
      },
      body: JSON.stringify({
        query: query,
      }),
    });
    const {data} = await request.json();
    return data.orders.edges[0];
  } catch (err) {
    throw new Error(err);
  }
};
const getOrderByPhoneNumber = async(phone) =>{
  try{
    if(!phone){
      throw new Error("Phone number not provided");
    }
  }catch(err){
    throw new Error(err.message);
  }
}
export { getOrderDetails,getOrderByPhoneNumber };
