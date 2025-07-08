import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center gap-4 my-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-24 hover:scale-110 transition" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-24 hover:scale-110 transition" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-center text-blue-600 mb-4">Vite + React + Tailwind</h1>

      <div className="card bg-white shadow-md rounded p-6 text-center max-w-md mx-auto">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4"
        >
          Count is {count}
        </button>
        <p className="text-gray-700">
          Edit <code className="bg-gray-100 px-1 py-0.5 rounded">src/pages/Home.tsx</code> and save
          to test HMR
        </p>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
