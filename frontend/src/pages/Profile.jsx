import { useApp } from "../context/AppContext";

export default function Profile() {
  const { user } = useApp();

  return (
    <div className="page">
      <div className="page-header">
        <h1>My profile</h1>
        <p>Personal details, credentials, and device preferences.</p>
      </div>

      <div className="panel">
        <h2>Basic info</h2>
        <p>Name: {user.name}</p>
        <p>Role: {user.role}</p>
        <p>Location: {user.location}</p>
        <p>Preferred language: {user.language}</p>
      </div>
    </div>
  );
}
