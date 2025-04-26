import { useState, useEffect } from "react";
import Rules from "./rules/Rules";
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, Link } from "react-router-dom";
import SoundtrackButton from "./musicplayer"
import SoundtrackButtonLobby from "./musicplayer_lobby"
import RulesForNerds from "./rules/Rules-for-nerds-first";
import RulesForNerds2 from "./rules/Rules-for-nerds-2";
import RulesForNerds3 from "./rules/Rules-for-nerds-3";
import RulesForNerds4 from "./rules/Rules-for-nerds-4";
import RulesForNerds5 from "./rules/Rules-for-nerds-5";
import RulesForNerds6 from "./rules/Rules-for-nerds-6";
import RulesForNerds7 from "./rules/Rules-for-nerds-7";
import RulesForNerdsLast from "./rules/Rules-for-nerds-last";
import FloatingMessage from "./FloatingMessage";

const BACKEND_URL = "https://tjuvpakk-backend.onrender.com"; //ONLINE
//const BACKEND_URL = "http://localhost:5000"; // OFFLINE

interface Player {
  name: string;
  admin: boolean;
  hp: number;
  coins: number;
  attackDamage: number;
  alive: boolean;
  messages: (string | string[])[];
  idle_rounds: number;
}

interface LobbyState {
  round: number;
  players: Player[];
  winner: string | null;
  raidwinner: string | null;
  pending_deny: string | null;
  deny_target: string | null;
  readyPlayers: string[];
  round_end_time: number | null;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/rules/p1" element={<RulesForNerds />} />
        <Route path="/rules/p2" element={<RulesForNerds2 />} />
        <Route path="/rules/p3" element={<RulesForNerds3 />} />
        <Route path="/rules/p4" element={<RulesForNerds4 />} />
        <Route path="/rules/p5" element={<RulesForNerds5 />} />
        <Route path="/rules/p6" element={<RulesForNerds6 />} />
        <Route path="/rules/p7" element={<RulesForNerds7 />} />
        <Route path="/rules/p8" element={<RulesForNerdsLast />} />
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
  <div className="relative w-screen min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center" style={{ backgroundImage: `url(/images/bakgrunn.png)` }}>
  {/* Bakgrunnsbilde Image */}
  <img
    src="/images/bakgrunn.png"
    alt="Background"
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
  />

   {/* Soundtrack Button in Top-Right Corner */}
   <div className="absolute top-4 right-4 z-20">
      <SoundtrackButton />
    </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center">
  <img
  src="/images/logo.png" 
  alt="Logo"
  className="h-60 w-80 sm:h-50 sm:w-100 md:h-60 md:w-120 lg:h-90 lg:w-135 object-contain mb-8"
/>
    

    {/* Instructions */}
    <div className="text-center mb-5">
      <h2 className="text-lg text-black"><span className="text-green-600">O</span>ne Person needs to create a lobby</h2>
      <h2 className="text-lg text-black"><span className="text-green-600">T</span>hen share the lobby id to other players</h2>
    </div>

    {/* Input Fields and Join Button */}
    <div className="flex flex-col items-center space-y-4 mt-4">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded-l-md bg-gray-200 text-gray-600 focus:outline-none border-2 border-black"
      />
      <div className="flex items-center w-64">
        <input
          type="text"
          placeholder="Lobby code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="w-full p-2 rounded-l-md bg-gray-200 text-gray-600 focus:outline-none border-2 border-black"
        />
        <button
          onClick={handleJoin}
          style={{
            padding: "10px 20px",
            margin: "5px",
            border: "2px solid black",
            borderRadius: "5px",
            backgroundColor:  "#ddd",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Join
        </button>
      </div>
      <button
        onClick={handleCreate}
        style={{
          padding: "10px 20px",
          margin: "5px",
          border: "2px solid black",
          borderRadius: "5px",
          backgroundColor:  "#ddd",
          color: "black",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Create lobby
      </button>
    </div>
    <div className="text-blue-800 underline text-3xl mt-4 text-center">
      <Link to="/rules" style={{ color: "gold" }}>
        📜 Rules 📜
      </Link>
    </div>
    <div className="text-blue-800 underline text-3xl mt-2 text-center">
      <Link to="/rules/p1" style={{ color: "gold", fontSize : "24px"}}>
        📜 Rules For Nerds 📜
      </Link>
    </div>
  </div>
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

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const [floatingMessages, setFloatingMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!state?.round_end_time) {
      setSecondsLeft(null);
      return;
    }
  
    const interval = setInterval(() => {
      const now = Date.now() / 1000;
      const endTime = state.round_end_time ?? 0; // fallback, selv om vi vet den finnes
  
      const remaining = Math.max(0, Math.floor(endTime - now));
      setSecondsLeft(remaining);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [state?.round_end_time]);

  useEffect(() => {
    // Nullstill statusmelding når ny runde starter
    setStatusMsg("");
    setDenyTarget("");
    setTarget("");
    setAction("");
    setResource("");
  }, [state?.round]);

  useEffect(() => {
    if (state?.winner) return;
    const fetchState = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/get_state/${lobbyId}`);
        if (!res.ok) {
          console.warn("get_state feilet med status:", res.status);
          return;
        }
        const json: LobbyState = await res.json();
        setState(json);
      } catch (error) {
        console.error("Feil ved get_state:", error);
      }
    };
  
    fetchState(); // en gang når round endres

    // Poller state hvert 2. sekund
    const interval = setInterval(() => {
      if (!state?.winner) {
        fetchState();
      }
    }, 2000);
  
    return () => clearInterval(interval);
  }, [state?.round, lobbyId, playerName, state?.winner]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessages([]);
        const res = await fetch(`${BACKEND_URL}/get_player_messages/${lobbyId}/${playerName}`);
        if (!res.ok) return;
        const json = await res.json();
        const newMsgs: string[][] = json.messages || [];
        console.log("json.messages", newMsgs);

        // Hvis det er nye meldinger, vis dem som én gruppe
        const newFlat = newMsgs.flat().join("\n");
        const currentFlat = messages.flat().join("\n");

        if (newFlat !== currentFlat) {
          setFloatingMessages((prev) => [...prev, newFlat]);
          setTimeout(() => {
            setMessages(newMsgs);
          }, 2500); // 2500 millisekunder = 2.5 sekunder
        }
      } catch (error) {
        console.error("Feil ved get_player_messages:", error);
      }
    };
  
    fetchMessages();
  }, [state?.round, lobbyId, playerName, isDenied]);
  
  // useEffect(() => {
  //   if (floatingMessages.length === 0) {
  //     const fetchMessages = async () => {
  //       try {
  //         const res = await fetch(`${BACKEND_URL}/get_player_messages/${lobbyId}/${playerName}`);
  //         if (!res.ok) return;
  //         const json = await res.json();
  //         setMessages(json.messages || []);
  //       } catch (error) {
  //         console.error("Feil ved henting av meldinger etter FloatingMessage:", error);
  //       }
  //     };
  
  //     fetchMessages();
  //   }
  // }, [floatingMessages.length, lobbyId, playerName]);
  

  const myPlayer = state?.players.find(p => p.name === playerName);
  const otherPlayers = state?.players.filter(p => p.name !== playerName && p.hp > 0);
  const isAlive = (state?.players.find(p => p.name === playerName)?.hp ?? 0) > 0;
  const isAdmin = myPlayer?.admin

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="fixed top-0 left-0 w-full h-full z-0">      
        {/* Bakgrunnsbilde Image */}
        <img
          src="/images/bakgrunn2.jpg"
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
      </div>
      {/* Soundtrack Button in Top-Right Corner */}
      <div className="absolute top-4 right-4 z-20">
        <SoundtrackButtonLobby />
      </div>
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col items-center justify-center rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
          <h2 className="text-3xl font-extrabold text-gray-900 mt-6 mb-4 tracking-tight animate-fade-in">
            Lobby ID: {lobbyId}
          </h2>
          <p className="mb-3 text-lg text-gray-600 font-medium">
            🌀 Round: {state?.round ?? "?"}
          </p>
          <p className="mb-6 text-lg text-gray-600 font-medium">
            🦹‍♂️ Your Name: {playerName}
          </p>
    
          <div className="w-full mb-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-xl text-gray-800 mb-4">Players in Lobby</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {state?.players.map(p => (
                <li key={p.name} className="py-1 flex items-center gap-2">
                  {p.hp <= 0 && <span className="text-red-500">☠️</span>}
                  {(state.winner === p.name || (!state.winner && state.raidwinner === p.name)) && (
                    <span className="text-yellow-500">👑</span>
                  )}
                  <span className="font-medium">{p.name}</span>
                  {isAdmin && p.name !== playerName && p.hp > 0 && state?.round === 0 && (
                    <span
                      className="ml-2 text-red-500 text-sm cursor-pointer"
                      title="Kick player"
                      onClick={async () => {
                        try {
                          const res = await fetch(`${BACKEND_URL}/kick_player/${lobbyId}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ admin: playerName, target: p.name }),
                          });
                          if (!res.ok) {
                            const errorData = await res.json();
                            alert(errorData.error);
                            return;
                          }
                        } catch (error) {
                          alert(error)
                        }
                      }}
                    >❌</span>
                  )}
                  {state.readyPlayers?.includes(p.name) && <span className="text-green-500">✅</span>}
                  {p.idle_rounds >= 2 && <span className="text-gray-400">👻</span>}
                </li>
              ))}
            </ul>
          </div>
          {isAdmin && state?.round === 0 && (
            <button
              onClick={async () => {
                const res = await fetch(`${BACKEND_URL}/start_game/${lobbyId}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ admin: playerName }),
                });
                if (!res.ok) {
                  const data = await res.json();
                  alert(data.error || "Failed to start game");
                }
              }}
              style={{
                padding: "10px 20px",
                margin: "20px",
                border: "2px solid black",
                borderRadius: "8px",
                backgroundColor: "goldenrod",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🚀 Start Game
            </button>
          )}
          {floatingMessages.map((msg, idx) => (
            <FloatingMessage
              key={idx}
              message={msg}
              onDone={() => {
                setFloatingMessages((prev) => prev.filter((_, i) => i !== idx));
              }}
            />
          ))}
    
          <div className="w-full mb-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-xl text-gray-800 mb-4">Your Stats</h3>
            <p className="text-gray-700 flex gap-4">
              <span>
                ❤ <span className="font-semibold text-red-500">{myPlayer?.hp}</span>
              </span>
              <span>
                💰 <span className="font-semibold text-yellow-500">{myPlayer?.coins}</span>
              </span>
              <span>
                ⚔ <span className="font-semibold text-blue-500">{myPlayer?.attackDamage}</span>
              </span>
            </p>
          </div>
    
          {!gameOver && !isDenied && isAlive && state?.round !== 0 && (
            <div className="w-full mb-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-3">Choose Resource</h4>
                <div className="flex flex-wrap gap-3">
                {[
                  { id: "gain_hp", label: "Get ❤" },
                  { id: "gain_coin", label: "Get 💰" },
                  { id: "gain_attack", label: "Buy ⚔" },
                ].map((res) => (
                  <button
                    key={res.id}
                    onClick={async () => {
                      try {
                        const response = await fetch(`${BACKEND_URL}/submit_choice/${lobbyId}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ player: playerName, resource: res.id, action: "" }),
                        });
                        const data = await response.json();
                        if (!response.ok) {
                          alert(data.error || "API error");
                        } else {
                          setResource(res.id);
                        }
                      } catch (err) {
                        alert("Server error");
                        console.error(err);
                      }
                    }}
                    style={{
                      padding: "5px 12px",
                      margin: "3px",
                      border: "2px solid black",
                      borderRadius: "5px",
                      backgroundColor: resource === res.id ? "crimson" : "#ddd",
                      color: resource === res.id ? "white" : "black",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {res.label}
                  </button>
                ))}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">Choose Action</h4>
                <div className="flex flex-wrap gap-3">
                {["attack", "defend", "raid"].map((act) => (
                  <button
                    key={act}
                    onClick={async () => {
                      setAction(act);
                      
                      // Ikke send med en gang hvis det er "attack" – vent på target
                      if (act !== "attack") {
                        try {
                          const response = await fetch(`${BACKEND_URL}/submit_choice/${lobbyId}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ player: playerName, action: act, resource: "" }),
                          });
                          const data = await response.json();
                          if (!response.ok) alert(data.error || "API error");
                        } catch (err) {
                          alert("Server error");
                          console.error(err);
                        }
                      }
                    }}
                    style={{
                      padding: "5px 12px",
                      margin: "3px",
                      border: "2px solid black",
                      borderRadius: "5px",
                      backgroundColor: action === act ? "crimson" : "#ddd",
                      color: action === act ? "white" : "black",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {act.toUpperCase()}
                  </button>
                ))}
                  {action === "attack" && (
                  <select
                    value={target}
                    onChange={async (e) => {
                      const chosen = e.target.value;
                      setTarget(chosen);

                      try {
                        const response = await fetch(`${BACKEND_URL}/submit_choice/${lobbyId}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            player: playerName,
                            action: "attack",
                            target: chosen,
                            resource: ""
                          }),
                        });
                        const data = await response.json();
                        if (!response.ok) alert(data.error || "API error");
                      } catch (err) {
                        alert("Server error");
                        console.error(err);
                      }
                    }}
                    style={{
                      padding: "5px",
                      border: "2px solid black",
                      borderRadius: "5px",
                      backgroundColor: "white",
                      color: "black",
                      fontSize: "16px",
                      margin: "10px 0",
                      width: "33%", // valgfritt – gjør at det fyller bredden
                    }}
                  >
                    <option value="">Select target</option>
                      {otherPlayers?.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                  </select>
                )}
                </div>
              </div>
            </div>
          )}

          {secondsLeft !== null && secondsLeft <= 20 && !gameOver &&(
            <p className={`mb-2 text-lg font-semibold ${
              secondsLeft !== null && secondsLeft <= 10 ? "text-red-700 animate-pulse" : "text-red-600"
            }`}>
              ⏳ Time left: {secondsLeft}s
            </p>
          )}
          <div
  className={`w-full mt-2 mb-6 transition-opacity ${
    floatingMessages.length > 0 ? "opacity-0 duration-0" : "opacity-100 duration-1000"
  }`}
>
          <div 
            key={messages.length}
            className="w-full mt-2 mb-6 animate-fade-in">
            <h3 className="font-semibold text-xl text-gray-800 mb-4 px-6">Round Messages</h3>
            <ul className="list-disc pl-6 text-gray-700 bg-white p-6 rounded-xl shadow-sm space-y-2">
              {messages?.map((m, i) => (
                <li key={i} className="py-1">{Array.isArray(m) ? m.join(" ") : m}</li>
              ))}
            </ul>
          </div>
    
            {isChoosingDeny && (
              <div className="bg-yellow-50 border border-yellow-200 p-6 mt-6 rounded-xl shadow-sm animate-slide-up">
                <h3 className="font-semibold text-lg text-yellow-800 mb-4">
                  🛑 Choose someone to deny next round
                </h3>
                <div className="flex gap-4 items-center">
                  <select
                    className="border border-gray-200 rounded-lg p-2.5 bg-white text-gray-700 flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    value={denyTarget}
                    onChange={e => setDenyTarget(e.target.value)}
                  >
                    <option value="">Select player</option>
                    {eligibleTargets.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <button
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
                    style={{
                      padding: "10px 20px",
                      margin: "5px",
                      border: "2px solid black",
                      borderRadius: "5px",
                      backgroundColor:  "#ddd",
                      color: "black",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Deny
                  </button>
                </div>
              </div>
            )}
    
            {gameOver && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl mt-6 text-center shadow-sm animate-slide-up">
                <p className="text-xl font-semibold mb-3">
                  🎉 Game Over! {alivePlayers[0]?.name} has won the game!
                </p>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  ← Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

{/* GAMMELT DESIGN */}

//         <div className="p-6 max-w-2xl mx-auto items-center flex flex-col">
//       <h2 className="text-xl mb-2">Lobby-id: {lobbyId}</h2>
//       <p className="mb-4 text-lg">🌀 Round: {state?.round ?? "?"}</p>
//       <p className="mb-4 text-lg">🦹‍♂️ Your Name: {playerName}</p>
//       <div className="mb-4">
//         <h3 className="font-bold">Players in Lobby</h3>
//         <ul className="list-disc pl-6">
//         {state?.players.map(p => (
//           <li key={p.name}>
//             {p.hp <= 0 && "☠️ "}
//             {(state.winner === p.name || (!state.winner && state.raidwinner === p.name)) && "👑 "}
//             {p.name}
//             {state.readyPlayers?.includes(p.name) && " ✅"}
//           </li>
//         ))}
//         </ul>
//       </div>
//       <div className="mb-4">
//         <h3 className="font-bold">Your Stats</h3>
//         <p>❤: {myPlayer?.hp} | 💰: {myPlayer?.coins} | ⚔: {myPlayer?.attackDamage}</p>
//       </div>
//       {!gameOver && !isDenied && isAlive &&(
//   <div className="mb-4">
//     <div className="mb-2">
//       <h4 className="font-semibold mb-1">Choose Action</h4>
//       <div className="flex flex-wrap gap-2">
//         {["attack", "defend", "raid"].map(act => (
//           <button
//             key={act}
//             className={`p-2 border rounded ${
//               action === act ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setAction(act)}
//             >
//             {act.charAt(0).toUpperCase() + act.slice(1)}
//           </button>
//         ))}
//         {action === "attack" && (
//           <select className="border p-2 mb-2" value={target} onChange={e => setTarget(e.target.value)}>
//             <option value="">Select target</option>
//             {otherPlayers?.map(p => (
//               <option key={p.name} value={p.name}>{p.name}</option>
//             ))}
//           </select>
//         )}
//       </div>
//     </div>
//     <div>
//       <h4 className="font-semibold mb-1">Choose Resource</h4>
//       <div className="flex flex-wrap gap-2">
//         {[
//           { id: "gain_hp", label: "Get ❤" },
//           { id: "gain_coin", label: "Get 💰" },
//           { id: "gain_attack", label: "Get ⚔" },
//         ].map(res => (
//           <button
//             key={res.id}
//             className={`p-2 border rounded ${
//               resource === res.id ? "bg-green-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setResource(res.id)}
//           >
//             {res.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   </div>
// )}
//       {!gameOver && !isDenied && isAlive &&(
//         <>
//       <button className="bg-blue-600 text-white px-4 py-2" onClick={handleSubmit}>Submit</button>
//         </>
//       )}
//           {statusMsg && <p className="mt-2 text-sm text-gray-700">{statusMsg}</p>}

//       <div className="mt-6">
//         <h3 className="font-bold mb-2">Round Messages</h3>
//         <ul className="list-disc pl-6">
//           {messages?.map((m, i) => (
//             <li key={i}>{Array.isArray(m) ? m.join(" ") : m}</li>
//           ))}
//         </ul>
//         {isChoosingDeny && (
//   <div className="bg-yellow-100 border border-yellow-300 p-4 mt-4 rounded">
//     <h3 className="font-bold mb-2">🛑 Choose someone to deny next round</h3>
//     <select
//       className="border p-2 mr-2"
//       value={denyTarget}
//       onChange={(e) => setDenyTarget(e.target.value)}
//     >
//       <option value="">Select player</option>
//       {eligibleTargets.map((p) => (
//         <option key={p.name} value={p.name}>
//           {p.name}
//         </option>
//       ))}
//     </select>
//     <button
//       className="bg-red-500 text-white px-4 py-2"
//       disabled={!denyTarget}
//       onClick={async () => {
//         const res = await fetch(`${BACKEND_URL}/submit_deny_target/${lobbyId}`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ player: playerName, target: denyTarget }),
//         });
//         if (res.ok) {
//           setStatusMsg("🚫 Deny choice submitted!");
//         } else {
//           setStatusMsg("❌ Something went wrong submitting deny.");
//         }
//       }}
//     >
//       Deny
//     </button>
//   </div>
// )}
//         {gameOver && (
//           <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded mt-6 text-center">
//           🎉 Game Over! {alivePlayers[0]?.name} has won the game!
//           <Link to="/" className="underline text-blue-600" style={{ fontSize: "1rem" }}>
//           ← Back to Home
//           </Link>
//           </div>
//           )}
//       </div>
//     </div>

