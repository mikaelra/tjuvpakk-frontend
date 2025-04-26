import { useEffect, useState } from "react";
import { BACKEND_URL } from "./config";
import { Link } from "react-router-dom";
import SoundtrackButtonLeaderboards from "./music/SoundtrackButtonLeaderboards";

export default function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState<any>(null);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/leaderboards`);
        const json = await res.json();
        setLeaderboard(json);
      } catch (err) {
        console.error("Failed to fetch leaderboards:", err);
      }
    };

    fetchLeaderboards();
  }, []);

  if (!leaderboard) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <img
        src="/images/leaderboards.png"
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
        <SoundtrackButtonLeaderboards />
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm p-8 z-10">
        <h1 className="text-3xl font-bold mb-6">🏆 Leaderboards 🏆</h1>

        <LeaderboardSection title="Top 5 Most Wins" players={leaderboard.top_wins} statKey="wins" />
        <LeaderboardSection title="Top 5 Most Kills" players={leaderboard.top_kills} statKey="kills" />
        <LeaderboardSection title="Top 5 Most Played Games" players={leaderboard.top_played} statKey="played_games" />
        <LeaderboardSection title="Top 5 Most Raid Wins" players={leaderboard.top_raid_wins} statKey="raid_wins" />

        <div className="mt-6">
          <Link to="/" className="underline text-blue-600" style={{ fontSize: "2rem" }}>
            ← Back to Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}

function LeaderboardSection({ title, players, statKey }: { title: string; players: any[]; statKey: string }) {
  return (
    <div className="mb-8 w-full">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <ul className="bg-white rounded-lg shadow p-4 space-y-2">
        {players.map((p, idx) => (
          <li key={idx} className="flex justify-between items-center border-b last:border-b-0 pb-2">
            <span className="font-bold">{idx + 1}. {p.name}</span>
            <span className="text-gray-600">{p[statKey]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
