import ExotelTextModel from "../models/ExotelText.js";
import { getOrderStatusByPhone } from "./actions.js";
import mapping from "./exotelMapping.js";

/**
 * Store exotel text response in db
 * @param {string} ssid - unique call ssid
 * @param {string} text - text to be stored
 * @returns {object} storedText
 */
const storeTextInDb = async (ssid, text) => {
  try {
    const storedText = await ExotelTextModel.findOneAndUpdate(
      { ssid },
      {
        ssid: ssid,
        text: text,
      },
      {
        upsert: true,
        new: true,
      }
    ).lean();
    return storedText;
  } catch (err) {
    throw new Error("Failed to store text in db reason -->" + err.message);
  }
};

/**
 * Get text by ssid
 * @param {string} ssid - unique call ssid
 * @returns {string} corresponding text
 */
const getTextBySsid = async (ssid) => {
  try {
    const storedText = await ExotelTextModel.findOne({ ssid }).lean();
    if (!storedText) {
      throw new Error("No text found for the ssid");
    }
    return storedText.text;
  } catch (err) {
    throw new Error("Failed to get text by ssid reason -->" + err.message);
  }
};

/**
 * Map flow id
 * @param {string} flowId
 * @returns {object} - corresponding flow action
 */
const mapFlowId = (flowId) => {
  try {
    if (!flowId) {
      throw new Error("Flow id missing");
    }
    const currentMapping = mapping;
    let correspondingAction = currentMapping.find((el) => el.key == flowId);
    if (!correspondingAction) {
      throw new Error("no action found for the given flow id");
    }
    return correspondingAction;
  } catch (err) {
    throw new Error("Failed to map flow id reason -->" + err.message);
  }
};

/**
 * Map action
 * @param {string} action - corresponding action
 * @param {string} phone - customer phone number
 * @param {digits} string - digits entered by customer
 */
const mapActionsToText = async (action, phone, digits) => {
  try {
    let text = null;
    switch (action) {
      case "order_status_phone":
        data = await getOrderStatusByPhone(phone);
        break;
      case "order_status_id":
        // get order status by order id
        break;
      case "order_refund_status_phone":
        // get order refund status by phone
        break;
      case "order_refund_status_id":
        // get order refund status by order id
        break;
      case "order_cancel_phone":
        // cancel order by phone
        break;
      case "order_cancel_id":
        // cancel order by order id
        break;
      case "store_locator":
        // send store trigger to limechat
        break;
      case "collaboration":
        // send collaboration trigger to limechat
        break;
      case "distibutor":
        // send distibutor trigger to limechat
        break;
      case "bulk_order":
        // send bulk order trigger to limechat
        break;
    }
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export { storeTextInDb, getTextBySsid, mapFlowId, mapActionsToText };
