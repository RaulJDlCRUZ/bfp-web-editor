import { useRef, useState, useEffect, JSX } from "react";

function ResizableSplit({
  leftChild,
  rightChild,
}: {
  leftChild: React.ReactNode;
  rightChild: React.ReactNode;
}): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftChildRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(500);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = () => setIsDragging(true);
  const stopDragging = () => setIsDragging(false);

  const handleDragging = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerLeft = containerRef.current.getBoundingClientRect().left;
    const newLeftWidth = e.clientX - containerLeft;
    setLeftWidth(Math.max(200, newLeftWidth)); // mínimo 200px
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("mouseup", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleDragging);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="flex w-full h-full" // Asegura que ocupe todo el espacio disponible
    >
      <div
        ref={leftChildRef}
        className="p-4 overflow-auto"
        style={{ width: leftWidth }}
      >
        {leftChild}
      </div>
      <div
        className="w-1 bg-gray-400 cursor-col-resize"
        onMouseDown={startDragging}
      />
      <div
        className="flex-1 p-4 overflow-auto"
        style={{ paddingTop: 0, paddingBottom: 0 }}
      >
        {rightChild}
      </div>
    </div>
  );
}

export default ResizableSplit;
