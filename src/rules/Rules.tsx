import { Link } from "react-router-dom";

export default function Rules() {
  return (
    <div className="p-4 text-center">
      <img
        src="/images/rules.svg"
        alt="Tjuvpakk Rules"
        style={{ maxWidth: "800px", width: "100%", margin: "0 auto", display: "block" }}
      />
      <div className="mt-4">
        <Link to="/" className="underline text-blue-600" style={{ fontSize: "4rem" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
