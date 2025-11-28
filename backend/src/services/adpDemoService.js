const adpDemoQueue = [];

/**
 * Queue a time event "for ADP".
 * In real mode, this is where you'd call ADP's API.
 */
export function queueTimeEventForAdp({ employeeAdpId, employeeName, eventType, timestamp }) {
  const event = {
    id: adpDemoQueue.length + 1,
    employeeAdpId,
    employeeName,
    eventType, // "CLOCK_IN", "CLOCK_OUT", "LUNCH_START", "LUNCH_END"
    timestamp: timestamp || new Date().toISOString(),
  };

  adpDemoQueue.push(event);

  console.log("[ADP DEMO] Queued event:", event);

  return event;
}

/**
 * Get all queued demo events (what we'd send to ADP).
 */
export function getQueuedAdpEvents() {
  return adpDemoQueue;
}

/**
 * Clear the queue (simulate "synced to ADP").
 */
export function clearAdpQueue() {
  adpDemoQueue.length = 0;
}
