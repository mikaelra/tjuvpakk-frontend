import { Link } from "react-router-dom";

export default function RulesForNerds3() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      {/* Bakgrunnsbilde Image */}
      <img
            src="/images/parchment.png"
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />
      <div className="w-full max-w-3xl flex flex-col items-center rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
        <img
          src="/images/rules/rulesp3.svg"
          alt="Tjuvpakk Rules"
          style={{ maxWidth: "800px", width: "100%", margin: "0 auto", display: "block" }}
        />
        <div className="mt-4">
          <Link to="/rules/p2" className="underline text-blue-600" style={{ fontSize: "2rem", marginRight: "20px" }}>
              ← Previous page
          </Link>
          <Link to="/" className="underline text-blue-600" style={{ fontSize: "2rem", marginRight: "20px" }}>
            🏠
          </Link>
          <Link to="/rules/p4" className="underline text-blue-600" style={{ fontSize: "2rem" }}>
            Next page → 
          </Link>
        </div>
      </div>
    </div>
  );
}
