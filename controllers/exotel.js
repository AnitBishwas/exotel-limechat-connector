import ExotelTextModel from "../models/ExotelText.js";

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
export { storeTextInDb, getTextBySsid };
