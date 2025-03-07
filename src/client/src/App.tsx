import { ReactNode } from "react";
import TWESVG from "./assets/twe/twe_logo.svg";
import "./App.css";

function App({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <img src={TWESVG} alt="TWE Logo" style={{ height: "40px" }} />
        <h1 style={{ margin: "0 auto", fontSize: "1.5rem" }}>BFP Web Editor</h1>
      </header>

      <main style={{ flex: 1, padding: "2rem" }}>{children}</main>

      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          borderTop: "1px solid #dee2e6",
          backgroundColor: "#f8f9fa",
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} TWE Project. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
