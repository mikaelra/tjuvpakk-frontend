import { Link } from "react-router-dom";
import SoundtrackButtonVault from "../music/SoundtrackButtonVault"

export default function TheVault() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      {/* Bakgrunnsbilde Image */}
      <img
        src="/images/vault.png"
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw", // Full viewport width
          height: "100vh", // Full viewport height
          objectFit: "cover", // Scale to cover
          zIndex: 0,
        }}
      />
      <div className="absolute top-4 right-4 z-20">
        <SoundtrackButtonVault />
      </div>
      <div className="w-full max-w-3xl flex flex-col items-center rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
        <p>You can soon use the secret code the lucky ones gets in raids.</p>
        <div className="mt-4">
          <Link to="/" className="underline text-blue-600" style={{ fontSize: "2rem", marginRight: "20px" }}>
            ← Back to Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
