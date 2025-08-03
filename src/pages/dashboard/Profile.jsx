export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div>
      <h2>👤 Profile</h2>
      <p><strong>Name:</strong> {currentUser?.name}</p>
      <p><strong>Email:</strong> {currentUser?.email}</p>
    </div>
  );
}
