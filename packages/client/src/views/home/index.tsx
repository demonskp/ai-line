export default function HomePage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  return (
    <div>
      <h1>Home</h1>
      <p>{apiUrl}</p>
    </div>
  );
}
