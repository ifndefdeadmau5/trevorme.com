// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import { render } from 'react-dom'
import React, { useRef } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import './style.css'

// Returns fitting styles for dragged/idle items
const fn = (order, down, originalIndex, curIndex, y) => index =>
  down && index === originalIndex
    ? { y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }
    : { y: order.indexOf(index) * 100, scale: 1, zIndex: '0', shadow: 1, immediate: false }

function DraggableList({ items }) {
  const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  console.log(order.current)

  const onClick = () => {
    const newOrder = order.current.reverse()
    console.log(newOrder)
    setSprings(fn(newOrder)) // Feed springs new style data, they'll animate the view without causing a single render
  }
  return (
    <div class="content" style={{ height: items.length * 100 }}>
      {springs.map(({ y }, i) => (
        // {springs.map((props, i) => (
        <animated.div
          onClick={onClick}
          key={i}
          style={{
            transform: interpolate([y], y => `translate3d(0,${y}px,0)`)
          }}
          children={items[i]}
        />
      ))}
    </div>
  )
}

export default DraggableList;
