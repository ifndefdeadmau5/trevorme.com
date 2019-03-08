
import React, { useState, useRef } from 'react';
import { useSprings, animated, interpolate, config } from 'react-spring';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';
import RepositoryInfo from '../components/RepositoryInfo';
import SimpleList from './SimpleList';

const fn = order => (index, a, b) => {
    const first = order.indexOf(index) === 0;
    const y = first ? 0 : -90 + order.indexOf(index) * 90;
    const x = first ? 100 : 0;
    const width = first ? 840 : 'auto';
    return { y, x, immediate: false, width };
  };

  const Root = styled.div({
    width: 1020,
  });
  
  const Wrapper = styled(Paper)(({ theme, selected }) => ({
    marginBottom: 24,
    position: 'absolute',
    width: 500,
  }));
  

const AnimatedWrapper = animated(Wrapper);


export default ({ groups }) => {
    const [openID, setOpenID] = useState(null);
    const groupKeys = Object.keys(groups);
    const groupKeysToIndex = groupKeys.reduce(
      (acc, curr, i) => ({
        ...acc,
        [curr]: i,
      }),
      {},
    );
    const order = useRef(groupKeys.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
    const [springs, setSprings] = useSprings(groupKeys.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  
    const onClick = key => event => {
      const selectedIndex = groupKeysToIndex[key];
      const newOrder = [
        groupKeysToIndex[key],
        ...order.current.filter(v => v !== selectedIndex),
      ];
      setSprings(fn(newOrder)); // Feed springs new style data, they'll animate the view without causing a single render
      order.current = newOrder;
  
      if (key === openID) {
        setOpenID(null);
      } else {
        setOpenID(key);
      }
    };
  
    return (
      <Root>
        {springs.map(({ y, x, width }, i, { length }) => {
          const key = groupKeys[i];
          const selected = key === openID;
          return (
            <AnimatedWrapper
              key={key}
              elevation={selected ? 8 : 2}
              selected={selected}
              style={{
                transform: interpolate(
                  [y, x],
                  (y, x) => `translate3d(${x}px,${y}px,0)`,
                ),
                width: interpolate([width], width => width),
              }}
            >
              <RepositoryInfo
                onClick={onClick(key)}
                src={groups[key].avatarUrl}
                name={key}
                url={groups[key].repoUrl}
                stars={groups[key].stars}
                showAll={selected}
              />
              <Divider />
              <Collapse in={selected} timeout="auto" unmountOnExit>
                <SimpleList items={groups[key]} />
              </Collapse>
            </AnimatedWrapper>
          );
        })}
      </Root>
    );
  };
  