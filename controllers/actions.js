import { getCustomerIdByPhoneNumber, getOrderByCustomerId } from "./shopify.js";

/**
 * Get order status by customer phone nuber
 * @param {string} phone - customer phone number
 */
const getOrderStatusByPhone = async (phone) => {
  try {
    const customerId = await getCustomerIdByPhoneNumber(phone);
    if (!customerId) {
      throw new Error("No order exists for this phone number.");
    }
    const order = await getOrderByCustomerId(customerId);
    console.dir(order, { depth: null });
  } catch (err) {
    console.log("Failed to get order status by phone reason -->" + err.message);
    return err.message;
  }
};

/**
 *
 * @param {object} order - shopify order
 */
const mapOrderStatus = (order) => {
    try{
        const isOrderCancelled = order.cancelledAt ? true : false;
        if(isOrderCancelled){
            return `Your order was cancelled successfully on ${new Date(order.cancelledAt).toLocaleDateString()}. Prepaid orders are refunded automatically in 5 to 7 working days on source account.`
        };
        if(order.fulfillments.length == 0){
            return `Your latest order is successfully confirmed and will be delivered to you in 2 to 5 working days`
        };
        const isRto = order.fulfillments.length > 0 && order.tracking.rto_date.ok;
        if(isRto){
            return `Your order was marked as returned on ${new Date(order.tracking.rto_date).toLocaleDateString()}.  For prepaid orders, refunds are processed in 5 – 7 business days in original mode of payment.`
        }
        const attempted_delivery = order.fulfillments.length > 0 && order.tracking.attempted_delivery.ok;
        if(attempted_delivery){
            return `Delivery was attempted on <Delivery attempt date> but was unsuccessful. Delivery will now be reattempted on the next working day`
        }

    }catch(err){
        throw new Error("Failed to get order status");
    }
};
export { getOrderStatusByPhone };
