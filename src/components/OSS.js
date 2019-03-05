import React, { useEffect, useState, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';
import axios from 'axios';
import { useSpring, animated, interpolate, useTransition } from 'react-spring';
import RepositoryInfo from '../components/RepositoryInfo';
import ContentLoader from '../components/ContentLoader';

import SimpleList from './SimpleList';

const Root = styled.div({
  marginTop: 64,
  minWidth: 800,
});

const Container = styled.div({
  display: 'flex',
});

// const Left = styled.div(({ hasDetail, theme }) => ({
//   marginRight: hasDetail ? theme.spacing(1) : 0,
// }));

// const CollapsibleLeft = animated(Left);

const Wrapper = styled(Paper)(({ theme, selected }) => ({
  marginBottom: 24,
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
}));

const USER_NAME = 'ifndefdeadmau5';

export default ({ className }) => {
  const [groups, setGroups] = useState(null);
  const [openID, setOpenID] = useState(null);

  async function fetchData() {
    const {
      data: { items },
    } = await axios.get(
      'https://api.github.com/search/issues?q=type:pr+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+repo:mdx-js/mdx+author:ifndefdeadmau5',
      // 'https://api.github.com/search/issues?q=type:pr+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5',
      // 'https://api.github.com/search/commits?q=type:pr+is:merged+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5', { headers: { accept: 'application/vnd.github.cloak-preview' } }
      // Below uses github's new search api
      // 'https://api.github.com/search/commits?q=repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5', { headers: { accept: 'application/vnd.github.cloak-preview' } }

      // Below searches all PR contributions among public repositories except mines
      // `https://api.github.com/search/issues?q=type:pr+is:public+author:${USER_NAME}+-user:${USER_NAME}`,
    );

    const groups = items.reduce((acc, curr) => {
      const key = 'repository_url';
      const repoName = curr[key].substring(29);
      const group = acc[repoName];
      const item = {
        text: curr.title.trim(),
        link: curr.html_url,
      };
      return {
        ...acc,
        [repoName]: group ? [...group, item] : [item],
      };
    }, {});

    for (const group of Object.entries(groups)) {
      const [repoName] = group;
      const {
        data: {
          owner: { avatar_url },
          html_url,
          stargazers_count,
        },
      } = await axios.get(`https://api.github.com/repos/${repoName}`);
      groups[repoName].avatarUrl = avatar_url;
      groups[repoName].repoUrl = html_url;
      groups[repoName].stars = stargazers_count;
    }

    setGroups(groups);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = key => event => {
    if (key === openID) {
      setOpenID(null);
    } else {
      setOpenID(key);
    }
  };

  const props = useSpring({
    width: openID ? '50%' : '100%',
    marginRight: openID ? 16 : 0,
  });

  // const transitions = useTransition(index, p => p, {
  //   from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
  //   enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
  //   leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  // })

  const items = groups
    ? Object.keys(groups).map((key, i, { length }) => {
        const selected = key === openID;
        return (
          <Wrapper
            // onClick={onClick}
            key={key}
            elevation={selected ? 8 : 2}
            selected={selected}
          >
            <RepositoryInfo
              onClick={handleClick(key)}
              src={groups[key].avatarUrl}
              name={key}
              url={groups[key].repoUrl}
              stars={groups[key].stars}
            />
            <Divider />
            <Collapse in={selected} timeout="auto" unmountOnExit>
              <SimpleList items={groups[key]} />
            </Collapse>
          </Wrapper>
        );
      })
    : [];

  console.log(items);

  return (
    <Root className={className}>
      {groups ? (
        <Container hasDetail={openID}>
          <animated.div style={props}>{items}</animated.div>
          <div>{openID && items.find(item => item.key === openID)}</div>
        </Container>
      ) : (
        <React.Fragment>
          {Array.from({ length: 5 }).map((v, i) => (
            <ContentLoader key={i} />
          ))}
        </React.Fragment>
      )}
    </Root>
  );
};
