import React, { useState } from "react";

const Collect = () => {
  const [key, setKey] = useState(0); // Key forces iframe to re-render

  const refreshIframe = () => {
    setKey((prev) => prev + 1); // Changing key refreshes the iframe
  };

  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      {/* Refresh Button */}
      <button
        onClick={refreshIframe}
        className="self-end mb-2 rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 transition"
      >
        Refresh
      </button>

      {/* Iframe */}
      <iframe
        key={key} // Key triggers re-render when changed
        src="https://fielddata.davidsengineering.com/-/single/WoAHUhCUUtVfCnQg5IwBoASaiFDyrpR?st=9JH7HgmxiYVi2wtuo!zsMO!7mk$9C3TDutMNPtezw8qBubAFDptgQEPqGT8gxA0Y"
        title="Collect Page"
        className="w-full h-[calc(100vh-124px)] rounded-xl border"
      />
    </div>
  );
};

export default Collect;