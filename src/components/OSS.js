import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import SimpleList from './SimpleList';

const Root = styled.div({
  marginTop: 64,
});

function stripCommitMessage(message) {
  if(message.includes('\n')) {
      return message.substring(0, message.indexOf('\n'))
  }
  return message;
}


export default ({ className }) => {
  const [commits, setCommits] = useState(null);

  async function fetchData() {
    const { data } = await axios.get(
      'https://api.github.com/repos/mui-org/material-ui/commits?author=ifndefdeadmau5',
    );
    setCommits(
      data.map(({ commit, html_url }) => ({
        text: stripCommitMessage(commit.message),
        link: html_url,
      })),
    );
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Root className={className}>
      {commits && <SimpleList commits={commits} />}
    </Root>
  );
};
