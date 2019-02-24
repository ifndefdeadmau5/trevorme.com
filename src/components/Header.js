import React, { useState, useEffect } from 'react';
import Appbar from '@material-ui/core/AppBar';
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
const StyledAppbar = styled(({ offsetY, ...rest }) => <Appbar {...rest} />)(({ offsetY, theme }) => ({
  backgroundColor: `rgba(255, 255, 255, ${offsetY/100})`,
  boxShadow: `0px 2px 4px -1px rgba(0,0,0,${Math.min(
    0.2,
    offsetY / THRESHOLD,
  )}), 0px 4px 5px 0px rgba(0,0,0,${Math.min(
    0.14,
    offsetY / THRESHOLD,
  )}), 0px 1px 10px 0px rgba(0,0,0,${Math.min(0.14, offsetY / THRESHOLD)})`,
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shortest,
  }),
}));
const StyledToolbar = styled(Toolbar)({
  justifyContent: 'center',
});

export default () => {
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

  return (
    <StyledAppbar offsetY={offsetY}>
      <StyledToolbar>
        <Wrapper>
          <Button>Home</Button>
          <div>
            <Button>Blog</Button>
            <Button>OSS</Button>
          </div>
        </Wrapper>
      </StyledToolbar>
    </StyledAppbar>
  );
};
