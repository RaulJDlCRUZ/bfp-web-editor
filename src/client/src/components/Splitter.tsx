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
  const rightChildRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(500);
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined
  );

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

  useEffect(() => {
    const updateHeight = () => {
      if (leftChildRef.current && rightChildRef.current) {
        const leftHeight = leftChildRef.current.offsetHeight;
        const rightHeight = rightChildRef.current.offsetHeight;
        setContainerHeight(Math.max(leftHeight, rightHeight));
      }
    };

    updateHeight();

    // Optionally, observe changes in child content
    const resizeObserver = new ResizeObserver(updateHeight);
    if (leftChildRef.current) resizeObserver.observe(leftChildRef.current);
    if (rightChildRef.current) resizeObserver.observe(rightChildRef.current);

    return () => resizeObserver.disconnect();
  }, [leftChild, rightChild]);

  return (
    <div
      ref={containerRef}
      className="flex w-full"
      style={{ height: containerHeight }}
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
      <div ref={rightChildRef} className="flex-1 bg-white p-4 overflow-auto">
        {rightChild}
      </div>
    </div>
  );
}

export default ResizableSplit;
