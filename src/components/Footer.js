import React from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GitHub from '../svgs/GitHub';
import LinkedIn from '../svgs/LinkedIn';

const Root = styled.div({
  display: 'flex',
  justifyContent: 'center',
  minHeight: 200,
  backgroundColor: 'white',
  borderTop: '1px solid #eeeeee',
});
const IconStyle = css({
  width: 36,
  height: 36,
  fill: '#757575',
});

const GitHubIcon = styled(GitHub)`
  ${IconStyle}
`;
const LinkedInIcon = styled(LinkedIn)`
  ${IconStyle}
`;

const Container = styled.div(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  width: 550,
}));

export default props => {
  return (
    <Root>
      <Container>
        <IconButton target="_blank" href="https://github.com/ifndefdeadmau5">
          <GitHubIcon />
        </IconButton>
        <IconButton target="_blank" href="https://www.linkedin.com/in/trevor91">
          <LinkedInIcon />
        </IconButton>
      </Container>
    </Root>
  );
};
