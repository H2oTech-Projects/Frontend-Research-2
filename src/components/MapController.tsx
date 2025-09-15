import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

const CustomZoomControl = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState<number>(8);
  useMapEvents({
    zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
    },
  });

  const zoomIn = () => {
    map.setZoom(map.getZoom() + 1);
  };

  const zoomOut = () => {
    console.log(map.getZoom() - 1)
    map.setZoom(map.getZoom() - 1);
  };

  return (
    <div className="absolute bottom-11 right-4 z-[800] flex w-8 flex-col content-center justify-center gap-4 text-slate-50">
      <div className="flex h-8 content-center justify-center rounded-lg bg-royalBlue p-2 text-sm font-bold">{zoomLevel}</div>
      <div className="flex h-16 w-8 flex-col content-center justify-center rounded-lg bg-royalBlue">
        <button
          className="flex items-center justify-center border-b border-black border-opacity-50 pb-1 dark:border-white"
          onClick={zoomIn}
          disabled={zoomLevel === 18}
          type="button"   // prevent form submission
        >
          <Plus size={20} />
        </button>
        <button
          className="flex items-center justify-center pt-1"
          onClick={zoomOut}
          disabled={zoomLevel === 5}
          type="button"   // prevent form submission
        >
          <Minus size={20} />
        </button>
      </div>
    </div>
  );
};

export default CustomZoomControl;
