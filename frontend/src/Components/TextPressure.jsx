import { useEffect, useRef, useState } from 'react';

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Poppins',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#000000',
  strokeColor = '#FFD700',
  className = '',
  minFontSize = 36,
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const isInitializedRef = useRef(false);

  const mouseRef = useRef({ x: -10000, y: -10000 }); 
  const cursorRef = useRef({ x: -10000, y: -10000 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const [isReady, setIsReady] = useState(false);

  // Split text into two lines
  const [firstLine, secondLine] = text.split('!').map(line => line.trim());
  const firstLineChars = firstLine.split('');
  const secondLineChars = secondLine.split('');

  const dist = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isInitializedRef.current) return;
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      if (!isInitializedRef.current) return;
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Delay initialization to prevent initial zoom
    setTimeout(() => {
      isInitializedRef.current = true;
      setIsReady(true);
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = left + width / 2;
        mouseRef.current.y = top + height / 2;
        cursorRef.current.x = mouseRef.current.x;
        cursorRef.current.y = mouseRef.current.y;
      }
    }, 500);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = () => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (Math.max(firstLineChars.length, secondLineChars.length) / 1.5);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1.2);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  };

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [scale, text]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      if (!isReady) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 8;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 8;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 3;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);

          const getAttr = (distance, minVal, maxVal) => {
            if (!isReady) return minVal;
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };

          // Default state for letters before animation starts
          const width = isReady ? getAttr(d, 1.0, 2.0) : 1.0;
          const scale = isReady ? getAttr(d, 1.0, 1.02) : 1.0;
          
          // No margin until animation starts
          const margin = isReady ? Math.max(0, (width - 1.0) * 0.2) : 0;
          
          span.style.transform = `scale(${scale})`;
          span.style.fontStretch = `${width * 100}%`;
          span.style.margin = `0 ${margin}rem`;
          span.style.zIndex = Math.floor(width * 10);
          span.style.fontWeight = isReady ? Math.floor(getAttr(d, 400, 700)) : 400;
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, firstLineChars.length, secondLineChars.length, isReady]);

  const dynamicClassName = [className, flex ? 'flex' : '', stroke ? 'stroke' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100%',
        background: 'transparent',
        margin: '0 -20px',
        padding: '0 20px',
      }}
    >
      <style>{`
        .flex {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2rem;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }

        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 4px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }

        .text-pressure-title span {
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.2, 0, 0.1, 1);
          margin: 0;
          position: relative;
          will-change: transform, font-stretch, margin, font-weight;
        }

        .text-line {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          letter-spacing: -0.05em;
        }
      `}</style>

      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          fontWeight: 900,
          width: '100%',
        }}
      >
        <div className="text-line">
          {firstLineChars.map((char, i) => (
            <span
              key={`first-${i}`}
              ref={(el) => (spansRef.current[i] = el)}
              data-char={char}
              style={{
                display: 'inline-block',
                color: stroke ? undefined : textColor
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="text-line">
          {secondLineChars.map((char, i) => (
            <span
              key={`second-${i}`}
              ref={(el) => (spansRef.current[i + firstLineChars.length] = el)}
              data-char={char}
              style={{
                display: 'inline-block',
                color: stroke ? undefined : textColor
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </h1>
    </div>
  );
};

export default TextPressure;
