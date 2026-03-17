import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  delay = 300,
  className = "",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const childRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!childRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    console.log("childRect", childRect);

    const tooltipWidth = 200; // Ancho estimado del tooltip
    const tooltipHeight = 40; // Alto estimado del tooltip
    const gap = 8; // Espacio entre el elemento y el tooltip

    let top = 0;
    let left = 0;

    const centerX = childRect.left + childRect.width / 2;
    const centerY = childRect.top + childRect.height / 2;

    switch (position) {
      case "top":
        top = centerY - tooltipHeight - gap;
        left = centerX - tooltipWidth / 2;
        break;
      case "bottom":
        top = centerY + gap;
        left = centerX - tooltipWidth / 2;
        break;
      case "left":
        top = centerY - tooltipHeight / 2;
        left = centerX - tooltipWidth - gap;
        break;
      case "right":
        top = centerY - tooltipHeight / 2;
        left = centerX + gap;
        break;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth - 10;
    }
    if (left < 10) {
      left = 10;
    }
    if (top < 10) {
      top = 10;
    }
    if (top + tooltipHeight > viewportHeight) {
      top = viewportHeight - tooltipHeight - 10;
    }

    setTooltipStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10000,
    });
  };

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          calculatePosition();
          setIsVisible(true);
        });
      });
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();

      const handleResize = () => {
        if (isVisible) calculatePosition();
      };

      window.addEventListener("scroll", handleResize, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleResize, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isVisible, position]);

  return (
    <>
      {React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement<any>, {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
          onFocus: showTooltip,
          onBlur: hideTooltip,
          ref: (node: HTMLElement | null) => {
            childRef.current = node;
            const element = children as React.ReactElement;
            const ref = (element.props as React.ComponentProps<any>)?.ref;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref && typeof ref === "object") {
              (ref as React.MutableRefObject<HTMLElement | null>).current =
                node;
            }
          },
        })
      ) : (
        <div
          ref={(node) => {
            childRef.current = node;
          }}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
          className="tooltip-trigger"
          style={{ display: "inline-flex", width: "fit-content" }}
        >
          {children}
        </div>
      )}

      {isVisible && !disabled && (
        <div
          className={`tooltip ${className}`}
          style={{
            ...tooltipStyle,
            position: "fixed",
            transform: "none", // Asegura que no haya transformaciones heredadas
            backgroundColor: "#333",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            maxWidth: "200px",
            wordWrap: "break-word",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: "none",
            zIndex: 10000,
          }}
        >
          {content}
          <div
            className="tooltip-arrow"
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderStyle: "solid",
              ...(position === "top" && {
                bottom: "-5px",
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "5px 5px 0 5px",
                borderColor: "#333 transparent transparent transparent",
              }),
              ...(position === "bottom" && {
                top: "-5px",
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "0 5px 5px 5px",
                borderColor: "transparent transparent #333 transparent",
              }),
              ...(position === "left" && {
                right: "-5px",
                top: "50%",
                transform: "translateY(-50%)",
                borderWidth: "5px 0 5px 5px",
                borderColor: "transparent transparent transparent #333",
              }),
              ...(position === "right" && {
                left: "-5px",
                top: "50%",
                transform: "translateY(-50%)",
                borderWidth: "5px 5px 5px 0",
                borderColor: "transparent #333 transparent transparent",
              }),
            }}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;
