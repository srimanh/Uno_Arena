import { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

import '../Styles/rulesPage.css';

function Masonry({ data }) {
  const columns = 4; // Fixed 4 columns
  const ref = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref]);

  const [heights, gridItems] = useMemo(() => {
    const heights = new Array(columns).fill(0);
    const itemsPerColumn = Math.ceil(data.length / columns);
    const gridItems = data.map((child, index) => {
      const column = Math.floor(index / itemsPerColumn);
      const x = (width / columns) * column;
      const height = 180; // Fixed height for 3 rows
      const y = (heights[column] += height + 20) - height;
      return { ...child, x, y, width: width / columns - 20, height };
    });
    return [heights, gridItems];
  }, [columns, width, data]);

  const transitions = useTransition(gridItems, {
    keys: (item) => item.id,
    from: ({ x, y, width, height }) => ({ 
      x, 
      y: y + 30,
      width, 
      height, 
      opacity: 0,
      scale: 0.9 
    }),
    enter: ({ x, y, width, height }) => ({ 
      x, 
      y,
      width, 
      height, 
      opacity: 1,
      scale: 1 
    }),
    update: ({ x, y, width, height }) => ({ 
      x, 
      y,
      width, 
      height 
    }),
    leave: { height: 0, opacity: 0, scale: 0.9 },
    config: { mass: 1, tension: 170, friction: 26 },
    trail: 20,
  });

  return (
    <div ref={ref} className="masonry" style={{ height: Math.max(...heights) + 20 }}>
      {transitions((style, item) => (
        <a.div
          key={item.id}
          style={{
            position: 'absolute',
            transform: style.scale.to(s => `scale(${s})`),
            opacity: style.opacity,
            x: style.x,
            y: style.y,
            width: style.width,
            height: style.height,
          }}
        >
          <div className="rule-card">
            <div className="rule-emoji">{item.emoji}</div>
            <h3 className="rule-title">{item.title}</h3>
            <p className="rule-description">{item.description}</p>
          </div>
        </a.div>
      ))}
    </div>
  );
}

export default Masonry;
