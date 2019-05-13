import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import StarRate from '@material-ui/icons/StarRate';

const Root = styled.div(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}));

const Wrapper = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: 24,
}));

const Stargazers = styled.div({
  alignItems: 'center',
  display: 'flex',
});

const ShadowAvatar = styled(Avatar)({
  border: '1px solid #b0bec5',
  borderRadius: 4,
  width: 48,
  height: 48,
});

export default ({ src, name, url, stars, onClick, showAll }) => (
  <Root onClick={onClick}>
    <ShadowAvatar src={src} />
    {/* {showAll && ( */}
    {true && (
      <Wrapper>
        <StyledLink color="inherit" href={url}>
          {name}
        </StyledLink>
        <Stargazers>
          <StarRate />
          <Typography>{stars}</Typography>
        </Stargazers>
      </Wrapper>
    )}
  </Root>
);
