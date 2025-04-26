import { useState } from "react";
import { Link } from "react-router-dom";
import SoundtrackButtonVault from "../music/SoundtrackButtonVault";
import InsideVault from "./InsideVault";
import { BACKEND_URL } from "../config"; // Importer riktig BACKEND_URL

export default function TheVault() {
  const [keycode, setKeycode] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [vaultResult, setVaultResult] = useState<{ first: boolean; seen_before?: number; og_keyfinder: string } | null>(null);

  const checkKeycode = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/vault_check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: keycode }),
      });

      if (!res.ok) {
        alert("Wrong code! Try again.");
        return;
      }

      const json = await res.json();
      sessionStorage.setItem("vault_code", keycode); // Hvis du trenger å lagre koden
      setVaultResult(json); // 🚀 Lagre resultatet
      setIsCorrect(true);
    } catch (err) {
      console.error("Error checking code:", err);
      alert("Server error. Try again later.");
    }
  };

  if (isCorrect && vaultResult) {
    return <InsideVault vaultResult={vaultResult} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <img
        src="/images/vault.png"
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      <div className="absolute top-4 right-4 z-20">
        <SoundtrackButtonVault />
      </div>
      <div
  className="w-full max-w-3xl flex flex-col items-center rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
  style={{ color: "black" }}
>
        <h3 className="font-semibold text-xl text-gray-800 mb-4">The Vault of Artifacts</h3>
        <p>In this vault lies ancient artifacts.</p>
        <p>Relics of the past.</p>
        <p>Lucky players will get the key to the first artifact.</p>
        <p>Everytime you win the raid, there is a 1 in 1000 chance to get the key.</p>
        <p>The first person to find the key, will have their name forever etched in this game.</p>
        <p>Their name will become an additional key to the artifact.</p>
        <p>The key will be an 8 digit number.</p>
        <p className="mt-4 font-bold">Do you have the key?</p>

        {/* INPUT FOR KEYCODE */}
        <input
          type="text"
          value={keycode}
          onChange={(e) => setKeycode(e.target.value)}
          maxLength={8}
          className="mt-4 p-2 border rounded"
          placeholder="Enter 8-digit code"
        />
        <button
          onClick={checkKeycode}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Unlock Vault
        </button>

        <div className="mt-4">
          <Link to="/" className="underline text-blue-600" style={{ fontSize: "2rem", marginRight: "20px" }}>
            ← Back to Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
