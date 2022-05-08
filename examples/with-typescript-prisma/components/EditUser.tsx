import { useEffect, useState } from "react";

const isProd = process.env.NODE_ENV === "production";
const API = isProd ? "https://github.com" : "http://localhost:3000/api";

export default function EditUser({ user }) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const onClick = () => {
    if (user) return;
    fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }).then(() => {
      alert("User created!");
    });
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={onClick}>Save</button>
    </div>
  );
}
