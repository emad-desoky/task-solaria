import React, { useEffect, useState } from "react";
import image from "./assets/0-floor.png";
import svgOverlay from "./assets/0-floor.svg";
import PolygonFilter from "./components/PolygonFilter";
import Tooltip from "./components/Tooltip";
import data from "./assets/data.json";

interface PolygonData {
  code: number;
  status: string;
  price: number;
}

const DEFAULT_OPACITY = "1";
const HOVER_OPACITY = "0.5";

const App: React.FC = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= 768);
  const [svgHTML, setSvgHTML] = useState<string>("");
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: PolygonData;
    position: { x: number; y: number };
  }>({
    visible: false,
    content: { status: "", price: 0, code: 0 },
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    const fetchSvg = async () => {
      const response = await fetch(svgOverlay);
      const svg = await response.text();
      setSvgHTML(svg);
    };

    fetchSvg();
  }, []);

  useEffect(() => {
    const manipulatePolygons = () => {
      const polygons = document.querySelectorAll<SVGPolygonElement>("polygon");

      polygons.forEach((polygon) => {
        const dataCode = polygon.getAttribute("data-code");
        if (dataCode) {
          const originalOpacity =
            polygon.getAttribute("opacity") || DEFAULT_OPACITY;

          polygon.addEventListener("mouseenter", (event) =>
            handleMouseEnter(event, polygon, dataCode)
          );
          polygon.addEventListener("mouseleave", () =>
            handleMouseLeave(polygon, originalOpacity)
          );
        }
      });
    };

    manipulatePolygons();
  }, [svgHTML]);

  const handleMouseEnter = (
    event: MouseEvent,
    polygon: SVGPolygonElement,
    dataCode: string
  ) => {
    const dataItem = data.find(
      (item: PolygonData) => item.code === parseInt(dataCode)
    );
    if (dataItem) {
      setTooltip({
        visible: true,
        content: dataItem,
        position: { x: event.clientX + 10, y: event.clientY + 10 },
      });
    }
    polygon.style.opacity = HOVER_OPACITY;
  };

  const handleMouseLeave = (
    polygon: SVGPolygonElement,
    originalOpacity: string
  ) => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    polygon.style.opacity = originalOpacity;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 1250);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <img
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          position: "absolute",
          top: isSmallDevice ? "0" : "-250px", // Adjust top based on device size
          left: "0",
        }}
        src={image}
        alt="Background"
      />
      <div
        style={{
          position: "absolute",
          top: isSmallDevice ? "0" : "-250px", // Adjust top based on device size
          left: "0",
          width: "100%",
          height: "100%",
        }}
        dangerouslySetInnerHTML={{ __html: svgHTML }}
      />

      {tooltip.visible && (
        <Tooltip content={tooltip.content} position={tooltip.position} />
      )}
      <PolygonFilter polygonData={data} />
    </>
  );
};

export default App;
