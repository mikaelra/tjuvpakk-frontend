import { useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "./config";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!name || !email) {
      setError("Please fill in both name and email.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/claim_name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Signup failed.");
        return;
      }

      // Success
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerEmail", email);
      setSuccess(true);
      setError(""); // Clear any old errors
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create User</h2>

        {!success && (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-2 border-2 border-black rounded text-gray-800"
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-6 p-2 border-2 border-black rounded text-gray-800"
            />

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <button
              onClick={handleSignup}
              style={{
                padding: "10px 20px",
                border: "2px solid black",
                borderRadius: "5px",
                backgroundColor: "#ddd",
                color: "black",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Create User
            </button>
          </>
        )}

        {success && (
          <div className="flex flex-col items-center">
            <p className="text-green-600 font-bold mb-6 text-center">
              🎉 Successfully created your account!
            </p>
            <Link
              to="/login"
              style={{
                padding: "10px 20px",
                border: "2px solid black",
                borderRadius: "5px",
                backgroundColor: "#ddd",
                color: "black",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Go to Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
