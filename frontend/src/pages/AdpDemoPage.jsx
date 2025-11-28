import { useState, useEffect } from "react";

function AdpDemoPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultMessage, setResultMessage] = useState("");

  const API_BASE = "http://localhost:5001/api/adp-demo";

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/pending`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error loading ADP demo events", err);
    } finally {
      setLoading(false);
    }
  };

  const queueSampleEvent = async () => {
    try {
      const body = {
        employeeAdpId: "DEMO123",
        employeeName: "Demo Employee",
        eventType: "CLOCK_IN",
      };

      const res = await fetch(`${API_BASE}/clock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await res.json();
      setResultMessage("Queued a CLOCK_IN event for Demo Employee.");
      await loadEvents();
    } catch (err) {
      console.error("Error queueing ADP demo event", err);
      setResultMessage("Error queueing demo event.");
    }
  };

  const clearQueue = async () => {
    try {
      await fetch(`${API_BASE}/clear`, { method: "POST" });
      setResultMessage("ADP event queue cleared.");
      await loadEvents();
    } catch (err) {
      console.error("Error clearing ADP demo queue", err);
      setResultMessage("Error clearing demo queue.");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-orange-400">
          ADP Integration Demo
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mt-1">
          This screen shows a queue of time events that CampbellOS would send to
          ADP once API access is approved. Right now it runs in demo mode and
          does not call ADP directly.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={queueSampleEvent}
          className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white text-sm"
        >
          Queue Sample ADP Event
        </button>
        <button
          onClick={clearQueue}
          className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-800 text-sm"
        >
          Clear Queue
        </button>
        {resultMessage && (
          <span className="text-xs text-emerald-400">{resultMessage}</span>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-100">
            Pending ADP Events
          </h3>
          {loading && (
            <span className="text-xs text-slate-400">Loading...</span>
          )}
        </div>

        {events.length === 0 && !loading && (
          <p className="text-xs text-slate-400">
            No demo events queued. Use &quot;Queue Sample ADP Event&quot; to add one.
          </p>
        )}

        {events.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800">
                  <th className="border border-slate-700 px-2 py-1 text-left">
                    ID
                  </th>
                  <th className="border border-slate-700 px-2 py-1 text-left">
                    ADP ID
                  </th>
                  <th className="border border-slate-700 px-2 py-1 text-left">
                    Employee
                  </th>
                  <th className="border border-slate-700 px-2 py-1 text-left">
                    Event
                  </th>
                  <th className="border border-slate-700 px-2 py-1 text-left">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td className="border border-slate-700 px-2 py-1">
                      {ev.id}
                    </td>
                    <td className="border border-slate-700 px-2 py-1">
                      {ev.employeeAdpId}
                    </td>
                    <td className="border border-slate-700 px-2 py-1">
                      {ev.employeeName}
                    </td>
                    <td className="border border-slate-700 px-2 py-1">
                      {ev.eventType}
                    </td>
                    <td className="border border-slate-700 px-2 py-1">
                      {ev.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500">
        Proof of concept: once ADP API credentials are provided, this queue can
        be wired to send events directly into ADP Workforce for payroll and
        timekeeping.
      </p>
    </div>
  );
}

export default AdpDemoPage;
