// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import { render } from 'react-dom'
import React, { useRef } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'

// Returns fitting styles for dragged/idle items
// const fn = (order, down, originalIndex, curIndex, y) => index =>
//   down && index === originalIndex
//     ? { y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }
const fn = (order, down, originalIndex, curIndex, y) => index => {
  const y = order.indexOf(index) === 3 ? 0 : order.indexOf(index) * 100;
  const x = order.indexOf(index) === 3 ? 600 : 0;
  // return ({ y: order.indexOf(index) * 100, scale: 1, zIndex: '0', shadow: 1, immediate: false });
  return ({ y, x, immediate: false });
}
  
  // down && index === originalIndex
    // ? { y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }

function DraggableList({ items }) {
  const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const onClick = () => {
    const newOrder = order.current.map(v => (v + 1) % 4)
    setSprings(fn(newOrder)) // Feed springs new style data, they'll animate the view without causing a single render
    
    order.current = newOrder; // Feed springs new style data, they'll animate the view without causing a single render
  }


  return (
    <div className="content">
      {springs.map(({ y, x }, i) => (
        // {springs.map((props, i) => (
        <animated.div
          onClick={onClick}
          key={i}
          style={{
            transform: interpolate([y, x], (y, x) => `translate3d(${x}px,${y}px,0)`)
          }}
          children={items[i]}
        />
      ))}
    </div>
  )
}

export default DraggableList;
