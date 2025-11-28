import { Router } from "express";
import {
  queueTimeEventForAdp,
  getQueuedAdpEvents,
  clearAdpQueue,
} from "../services/adpDemoService.js";

const router = Router();

/**
 * POST /api/adp-demo/clock
 * Body:
 *  - employeeAdpId (string)
 *  - employeeName (string, optional)
 *  - eventType ("CLOCK_IN" | "CLOCK_OUT" | "LUNCH_START" | "LUNCH_END")
 *  - timestamp (optional ISO; defaults to now)
 */
router.post("/clock", (req, res) => {
  const { employeeAdpId, employeeName, eventType, timestamp } = req.body;

  if (!employeeAdpId || !eventType) {
    return res.status(400).json({
      message: "employeeAdpId and eventType are required",
    });
  }

  const event = queueTimeEventForAdp({
    employeeAdpId,
    employeeName,
    eventType,
    timestamp,
  });

  res.status(201).json({
    message: "ADP demo event queued",
    event,
  });
});

/**
 * GET /api/adp-demo/pending
 * Returns all demo events that WOULD be sent to ADP.
 */
router.get("/pending", (req, res) => {
  res.json({ events: getQueuedAdpEvents() });
});

/**
 * POST /api/adp-demo/clear
 * Clears the demo queue.
 */
router.post("/clear", (req, res) => {
  clearAdpQueue();
  res.json({ message: "ADP demo queue cleared" });
});

export default router;
