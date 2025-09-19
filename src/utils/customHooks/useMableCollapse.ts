import { useMediaQuery } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";

type CollapseState = "default" | "table" | "map";

export function useMableCollapse() {
  const [collapse, setCollapse] = useState<CollapseState>("default");
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const tableCollapseBtn = useCallback(() => {
    if (!isDesktopDevice) {
      setCollapse("map");
    } else {
      setCollapse((prev) => (prev === "default" ? "table" : "default"));
    }
  }, [isDesktopDevice]);

  const mapCollapseBtn = useCallback(() => {
    if (!isDesktopDevice) {
      setCollapse("table");
    } else {
      setCollapse((prev) => (prev === "default" ? "map" : "default"));
    }
  }, [isDesktopDevice]);

  useEffect(() => {
    if (!isDesktopDevice && collapse === "default") {
      setCollapse("map");
    }
  }, [isDesktopDevice]);

  return { collapse, setCollapse, tableCollapseBtn, mapCollapseBtn };
}