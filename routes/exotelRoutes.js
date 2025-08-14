import { Router } from "express";
import mapExotelRequests from "../controllers/mapExotel.js";
import { sendLimeChatWhatsappTrigger } from "../controllers/limechat.js";
import {
  getTextBySsid,
  mapActions,
  mapFlowId,
  storeTextInDb,
} from "../controllers/exotel.js";

const exotelRoutes = Router();

exotelRoutes.get("/json", (req, res) => {
  console.log('request was hit')
  res
    .send({
      ok: true,
    })
    .status(200);
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
    const flowId = req.query.flow_id
      ? req.query.flow_id.replace(
          /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
          ""
        )
      : null;
    if (!flowId) {
      throw new Error("Flow id missing");
    }
    const { CallSid } = req.query;
    const customerPhone = req.query.From ? req.query.From : null;
    const digitsInserted = req.query.digits
      ? req.query.digits?.replace(
          /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
          ""
        )
      : null;
    const action = mapFlowId(flowId);
    const mapCorrespondingActions = await mapActions(
      action.value,
      customerPhone,
      digitsInserted
    );
    console.log(mapCorrespondingActions)
    if (mapCorrespondingActions.text) {
      const storeText = await storeTextInDb(
        CallSid,
        mapCorrespondingActions.text
      );
    }
    if (mapCorrespondingActions.whatsappLabel) {
      const trigger = await sendLimeChatWhatsappTrigger(
        CallSid,
        customerPhone,
        mapCorrespondingActions.whatsappLabel
      );
    }
    res.sendStatus(200);
  } catch (err) {
    console.log("Failed to handle request reason -->" + err.message);
    res.status(400).send({
      ok: false,
    });
  }
});


export default exotelRoutes;
