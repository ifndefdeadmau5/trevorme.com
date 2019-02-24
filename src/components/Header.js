import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

const THRESHOLD = 800;

const Wrapper = styled.div({
  maxWidth: 550,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
});
const StyledAppBar = styled(({ offsetY, ...rest }) => <AppBar {...rest} />)(({ offsetY, theme }) => ({
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shortest,
  }),
}));
const StyledToolbar = styled(Toolbar)({
  justifyContent: 'center',
});

export default ({ onSelect }) => {
  const [offsetY, setOffsetY] = useState(0);
  function listenScrollEvent() {
    if (Math.abs(offsetY - window.pageYOffset) > 30 || window.pageYOffset === 0) {
      setOffsetY(window.pageYOffset);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
    };
  });

  const handleClick = (index) => () => {
    onSelect(index);
  }

  return (
    <StyledAppBar style={{
      boxShadow: `0px 2px 4px -1px rgba(0,0,0,${Math.min(
        0.2,
        offsetY / THRESHOLD,
      )}), 0px 4px 5px 0px rgba(0,0,0,${Math.min(
        0.14,
        offsetY / THRESHOLD,
      )}), 0px 1px 10px 0px rgba(0,0,0,${Math.min(0.14, offsetY / THRESHOLD)})`,
      backgroundColor: `rgba(255, 255, 255, ${offsetY/100})`,
    }}>
      <StyledToolbar>
        <Wrapper>
          <Button onClick={handleClick(0)}>Home</Button>
          <div>
            <Button disabled>Blog</Button>
            <Button onClick={handleClick(1)}>OSS</Button>
          </div>
        </Wrapper>
      </StyledToolbar>
    </StyledAppBar>
  );
};
