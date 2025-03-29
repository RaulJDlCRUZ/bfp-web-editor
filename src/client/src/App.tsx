import { ReactNode } from "react";
import NavBar from "./components/NavBar";

function App({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-grow">
        {children} {/* Contenido específico de cada página */}
      </div>
      <footer className="bg-gray-200 text-center text-sm p-3">
        &copy; {new Date().getFullYear()} TWE Project. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
