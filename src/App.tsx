import { useState, useEffect } from "react";
import Rules from "./rules/Rules";
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, Link } from "react-router-dom";

const BACKEND_URL = "https://tjuvpakk-backend.onrender.com"; //ONLINE
//const BACKEND_URL = "http://localhost:5000"; // OFFLINE

interface Player {
  name: string;
  hp: number;
  coins: number;
  attackDamage: number;
  alive: boolean;
  messages: (string | string[])[];
}

interface LobbyState {
  round: number;
  players: Player[];
  winner: string | null;
  raidwinner: string | null;
  pending_deny: string | null;
  deny_target: string | null;
  readyPlayers: string[];
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/lobby/:lobbyId" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name) return;
    const res = await fetch(`${BACKEND_URL}/create_lobby`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!res.ok) {
      const errorData = await res.json(); // 👈 get the error body
      alert(errorData.error);
      return; // backend should send { "error": "..." }
    }

    const data = await res.json();
    localStorage.setItem("playerName", name);
    navigate(`/lobby/${data.lobby_id}`);
  };

  const handleJoin = async () => {
    if (!name || !joinCode) return;
    const res = await fetch(`${BACKEND_URL}/join_lobby/${joinCode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      localStorage.setItem("playerName", name);
      navigate(`/lobby/${joinCode}`);
    } else {
      const errorData = await res.json(); // 👈 get the error body
      alert(errorData.error);
      return; // backend should send { "error": "..." }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <p>One person needs to create a lobby.</p>
      <p>Then share the lobby id to the other players.</p>
      <input className="border p-2 w-full mb-2" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
      <div className="flex gap-2 mb-2">
        <input className="border p-2 flex-1" placeholder="Lobby code" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
        <button className="bg-blue-500 text-white px-4" onClick={handleJoin}>Join</button>
      </div>
      <button className="bg-green-600 text-white px-4 py-2 mt-2" onClick={handleCreate}>Create Lobby</button>
      <p></p>
      <Link to="/rules" className="block text-blue-600 underline mt-6 text-center">
  📜 Rules
      </Link>
    </div>
  );
}

function Lobby() {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const playerName = localStorage.getItem("playerName") || "";
  const [state, setState] = useState<LobbyState | null>(null);
  const [messages, setMessages] = useState<(string | string[])[]>([]);
  const [action, setAction] = useState<string>("");
  const [resource, setResource] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const alivePlayers = state?.players.filter(p => p.hp > 0) || [];
  const gameOver = alivePlayers.length === 1 && (state?.round ?? 0) > 1;
  const [denyTarget, setDenyTarget] = useState("");
  const deniedTarget = state?.deny_target;
  const isDenied = playerName === deniedTarget;

  const isChoosingDeny = state?.pending_deny === playerName;
  const eligibleTargets = state?.players.filter(p => p.name !== playerName && p.hp > 0) || [];

  const [statusMsg, setStatusMsg] = useState("");
  useEffect(() => {
    // Nullstill statusmelding når ny runde starter
    setStatusMsg("");
    setDenyTarget("");
    setTarget("");
    setAction("");
  }, [state?.round]);

  useEffect(() => {
    if (state?.winner) return; // ✅ Game is over – stop polling
    
    const interval = setInterval(async () => {
      try {
        const res1 = await fetch(`${BACKEND_URL}/get_state/${lobbyId}`);
        if (!res1.ok) {
          console.warn("get_state feilet med status:", res1.status);
          return;
        }
        const json1: LobbyState = await res1.json();
        setState(json1);
      } catch (error) {
        console.error("Feil ved get_state:", error);
      }
    
      try {
        const res2 = await fetch(`${BACKEND_URL}/get_player_messages/${lobbyId}/${playerName}`);
        if (!res2.ok) return;
        const json2 = await res2.json();
        setMessages(json2.messages);
      } catch (error) {
        console.error("Feil ved get_player_messages:", error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [lobbyId, playerName, state?.winner]);
  
  const handleSubmit = async () => {
    if (!action || !resource) {
      setStatusMsg("Please choose both action and resource.");
      return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/submit_choice/${lobbyId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: playerName, action, resource, target: target || null })
    });

    if (res.ok) {
      setStatusMsg("✅ Choice submitted!");
    } else {
      setStatusMsg("⚠️ Something went wrong. Try again.");
    }
  } catch (error) {
    console.error(error);
    setStatusMsg("🚨 Server error.");
  }
};

  const myPlayer = state?.players.find(p => p.name === playerName);
  const otherPlayers = state?.players.filter(p => p.name !== playerName && p.hp > 0);
  const isAlive = (state?.players.find(p => p.name === playerName)?.hp ?? 0) > 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl mb-2">Lobby-id: {lobbyId}</h2>
      <p className="mb-4 text-lg">🌀 Round: {state?.round ?? "?"}</p>
      <p className="mb-4 text-lg">🦹‍♂️ Your Name: {playerName}</p>
      <div className="mb-4">
        <h3 className="font-bold">Players in Lobby</h3>
        <ul className="list-disc pl-6">
        {state?.players.map(p => (
          <li key={p.name}>
            {p.hp <= 0 && "☠️ "}
            {(state.winner === p.name || (!state.winner && state.raidwinner === p.name)) && "👑 "}
            {p.name}
            {state.readyPlayers?.includes(p.name) && " ✅"}
          </li>
        ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Your Stats</h3>
        <p>❤: {myPlayer?.hp} | 💰: {myPlayer?.coins} | ⚔: {myPlayer?.attackDamage}</p>
      </div>
      {!gameOver && !isDenied && isAlive &&(
  <div className="mb-4">
    <div className="mb-2">
      <h4 className="font-semibold mb-1">Choose Action</h4>
      <div className="flex flex-wrap gap-2">
        {["attack", "defend", "raid"].map(act => (
          <button
            key={act}
            className={`p-2 border rounded ${
              action === act ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setAction(act)}
            >
            {act.charAt(0).toUpperCase() + act.slice(1)}
          </button>
        ))}
        {action === "attack" && (
          <select className="border p-2 mb-2" value={target} onChange={e => setTarget(e.target.value)}>
            <option value="">Select target</option>
            {otherPlayers?.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        )}
      </div>
    </div>
    <div>
      <h4 className="font-semibold mb-1">Choose Resource</h4>
      <div className="flex flex-wrap gap-2">
        {[
          { id: "gain_hp", label: "Get ❤" },
          { id: "gain_coin", label: "Get 💰" },
          { id: "gain_attack", label: "Get ⚔" },
        ].map(res => (
          <button
            key={res.id}
            className={`p-2 border rounded ${
              resource === res.id ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setResource(res.id)}
          >
            {res.label}
          </button>
        ))}
      </div>
    </div>
  </div>
)}
      {!gameOver && !isDenied && isAlive &&(
        <>
      <button className="bg-blue-600 text-white px-4 py-2" onClick={handleSubmit}>Submit</button>
        </>
      )}
          {statusMsg && <p className="mt-2 text-sm text-gray-700">{statusMsg}</p>}

      <div className="mt-6">
        <h3 className="font-bold mb-2">Round Messages</h3>
        <ul className="list-disc pl-6">
          {messages?.map((m, i) => (
            <li key={i}>{Array.isArray(m) ? m.join(" ") : m}</li>
          ))}
        </ul>
        {isChoosingDeny && (
  <div className="bg-yellow-100 border border-yellow-300 p-4 mt-4 rounded">
    <h3 className="font-bold mb-2">🛑 Choose someone to deny next round</h3>
    <select
      className="border p-2 mr-2"
      value={denyTarget}
      onChange={(e) => setDenyTarget(e.target.value)}
    >
      <option value="">Select player</option>
      {eligibleTargets.map((p) => (
        <option key={p.name} value={p.name}>
          {p.name}
        </option>
      ))}
    </select>
    <button
      className="bg-red-500 text-white px-4 py-2"
      disabled={!denyTarget}
      onClick={async () => {
        const res = await fetch(`${BACKEND_URL}/submit_deny_target/${lobbyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player: playerName, target: denyTarget }),
        });
        if (res.ok) {
          setStatusMsg("🚫 Deny choice submitted!");
        } else {
          setStatusMsg("❌ Something went wrong submitting deny.");
        }
      }}
    >
      Deny
    </button>
  </div>
)}
        {gameOver && (
          <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded mt-6 text-center">
          🎉 Game Over! {alivePlayers[0]?.name} has won the game!
          <Link to="/" className="underline text-blue-600" style={{ fontSize: "1rem" }}>
          ← Back to Home
          </Link>
          </div>
          )}
      </div>
    </div>
  );
}
