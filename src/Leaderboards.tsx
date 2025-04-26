import { Link } from "react-router-dom";
import SoundtrackButtonLeaderboards from "./music/SoundtrackButtonLeaderboards";

export default function Leaderboards() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      {/* Bakgrunnsbilde Image */}
      <img
        src="/images/parchment.png"
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
        <SoundtrackButtonLeaderboards />
      </div>
      <div className="w-full max-w-3xl flex flex-col items-center rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
        <p>Top 5 played games, Top 5 Wins ,Top 5 kills, Top 5 raid wins</p>
        <div className="mt-4">
          <Link to="/" className="underline text-blue-600" style={{ fontSize: "2rem", marginRight: "20px" }}>
            ← Back to Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
