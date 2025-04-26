import { useState } from "react";
import { BACKEND_URL } from "../config"; // Importer hvis nødvendig for submit
import SoundtrackButtonInsideVault from "../music/SoundtrackButtonInsideVault";

export default function InsideVault({ vaultResult }: { vaultResult: { first: boolean; seen_before?: number; og_keyfinder: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState("");
  console.log(vaultResult)

  const vaultCode = sessionStorage.getItem("vault_code") || "";

  const handleNameSubmit = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/vault_register_name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: vaultCode, name }),
      });
      const json = await res.json();
      if (json.success) {
        setNameSubmitted(true);
      } else {
        setError("Name already claimed!");
      }
    } catch (err) {
      console.error("Error submitting name:", err);
      setError("Server error. Try again.");
    }
  };

  const handleEmailSubmit = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/vault_register_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: vaultCode, email }),
      });
      const json = await res.json();
      if (json.success) {
        setEmailSubmitted(true);
      } else {
        setError("Email already claimed or you are not first!");
      }
    } catch (err) {
      console.error("Error submitting email:", err);
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
        
      <div className="absolute top-4 right-4 z-20">
        <SoundtrackButtonInsideVault />
      </div>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        textAlign: "center",
        color: "black" 
      }}>
        {vaultResult.first ? (
          <>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>🎉 Congrats! You are the first one to reach the vault! 🎉</h2>
            <p>Leave your name and/or email to claim special rewards!</p>

            {!nameSubmitted && (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                  }}
                />
                <button
                  onClick={handleNameSubmit}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Submit Name
                </button>
              </>
            )}

            {!emailSubmitted && (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                  }}
                />
                <button
                  onClick={handleEmailSubmit}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Submit Email
                </button>
              </>
            )}

            {(nameSubmitted || emailSubmitted) && (
              <p style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>
                ✅ Thanks for submitting!
              </p>
            )}
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Welcome to the Vault!</h2>
            { (vaultResult.og_keyfinder === "") && (
              <>
              <p> Noone has claimed the name yet.</p>
              <p> Now is your chance.</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                  }}
                />
                <button
                  onClick={handleNameSubmit}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Submit Name
                </button>
              </>
            )}
            <p style={{ marginTop: "20px" }}>
            You can share the vault code freely!
            </p>
            <p>{vaultResult.seen_before} players have been in the vault before you.</p>
            {(vaultResult.og_keyfinder !== "") && (
            <div>
            <p>The code is '{vaultCode}' and '{vaultResult.og_keyfinder}'.</p>
            </div>
            )}
          </>
        )}
        {error && <p style={{ marginTop: "20px", color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
