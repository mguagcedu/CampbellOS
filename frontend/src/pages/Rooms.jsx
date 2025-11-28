import { useApp } from "../context/AppContext";
import RoomStatusCard from "../components/RoomStatusCard";

export default function Rooms() {
  const { rooms } = useApp();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Room status</h1>
        <p>
          Who is in each operatory, cleaning progress, and readiness for the
          next patient.
        </p>
      </div>

      <section className="grid-3">
        {rooms.map(room => (
          <RoomStatusCard key={room.id} room={room} />
        ))}
      </section>
    </div>
  );
}
