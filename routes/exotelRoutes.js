import { Router } from "express";
import mapExotelRequests from "../controllers/mapExotel.js";
import { sendLimeChatWhatsappTrigger } from "../controllers/limechat.js";
import {
  getTextBySsid,
  mapActionsToText,
  mapFlowId,
  storeTextInDb,
} from "../controllers/exotel.js";

const exotelRoutes = Router();

exotelRoutes.get("/v2", async (req, res) => {
  try {
    const flowId = req.query.flow_id
      ? req.query.flow_id.replace(
          /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
          ""
        )
      : null;
    if (!flowId) {
      throw new Error("Flow id missing");
    }
    const customerPhone = req.query.From ? req.query.From : null;
    const digitsInserted = req.query.digits
      ? req.query.digits?.replace(
          /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
          ""
        )
      : null;
    const action = mapFlowId(flowId);
    console.log(action,customerPhone);
    const mapCorrespondingActions = await mapActionsToText(
      action.value,
      customerPhone,
      digitsInserted
    );
  } catch (err) {
    console.log("Failed to handle request reason -->" + err.message);
    res.status(400).send({
      ok: false,
    });
  }
});
exotelRoutes.get("/message", async (req, res) => {
  try {
    const { CallSid } = req.query;
    if (!CallSid) {
      throw new Error("Required parameter missing");
    }
    const text = await getTextBySsid(CallSid);
    res.setHeader("Content-Type", "text/plain").status(200).send(text);
  } catch (err) {}
});
exotelRoutes.get("/", async (req, res) => {
  try {
    const { CallSid } = req.query;
    if (!CallSid) {
      throw new Error("Required parameter missing");
    }
    const data = await mapExotelRequests(req, res);
    if (data.text) {
      const storedText = await storeTextInDb(CallSid, data.text);
    }
    if (data.whatsapp) {
      sendLimeChatWhatsappTrigger(data.order, data.whatsapp);
    }
    res.sendStatus(200);
  } catch (err) {
    console.log("Failed to handle request reason -->", err);
    res.status(400).send({
      ok: false,
    });
  }
});

exotelRoutes.get("/json", (req, res) => {
  res
    .send({
      ok: true,
    })
    .status(200);
});
export default exotelRoutes;
