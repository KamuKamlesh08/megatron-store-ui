import React, { useRef, useState } from "react";
import { Box } from "@mui/material";

interface Props {
  src: string;
  width?: number;
  height?: number;
  zoomFactor?: number;
}

const ImageZoomWithBox: React.FC<Props> = ({
  src,
  width = 400,
  height = 400,
  zoomFactor = 2,
}) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = imgRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setPosition({ x, y });
  };

  return (
    <Box sx={{ display: "flex", gap: 4 }}>
      {/* Main Image */}
      <Box
        ref={imgRef}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
        sx={{
          width,
          height,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid #ccc",
          cursor: "crosshair",
        }}
      />

      {/* Zoomed View */}
      {showZoom && (
        <Box
          sx={{
            width,
            height,
            border: "1px solid #aaa",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${width * zoomFactor}px ${height * zoomFactor}px`,
            backgroundPosition: `-${position.x * (zoomFactor - 1)}px -${
              position.y * (zoomFactor - 1)
            }px`,
            boxShadow: 2,
            backgroundColor: "#fff",
          }}
        />
      )}
    </Box>
  );
};

export default ImageZoomWithBox;
