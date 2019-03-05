import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSprings, animated, interpolate, config } from 'react-spring';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';
import axios from 'axios';
import RepositoryInfo from '../components/RepositoryInfo';
import ContentLoader from '../components/ContentLoader';

import SimpleList from './SimpleList';

const fn = (order, down, originalIndex, curIndex, y) => index =>
  down && index === originalIndex
    ? {
        y: curIndex * 149 + y,
        immediate: n => n === 'y' || n === 'zIndex',
        config: config.stiff,
      }
    : {
        y: order.indexOf(index) * 149,
        immediate: false,
        config: config.stiff,
      };

const Root = styled.div({
  marginTop: 64,
  minWidth: 800,
});

const Container = styled.div({
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

const AnimatedWrapper = animated(Wrapper);

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

  return (
    <Root className={className}>
      {groups ? (
        <Container hasDetail={openID}>
          <List groups={groups} />
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

const List = ({ groups }) => {
  console.log('groups');
  console.log(groups);

  const groupKeys = Object.keys(groups);
  
  const order = useRef(groupKeys.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings(groupKeys.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const selected = false;

  const onClick = () => {
    const newOrder = order.current.reverse()
    console.log(newOrder)
    setSprings(fn(newOrder)) // Feed springs new style data, they'll animate the view without causing a single render
  }

  return (
    <div className="content" style={{ height: groupKeys.length * 149 }}>
      {springs.map(({ y }, i, { length }) => {
        const key = groupKeys[i];
        return (
          <AnimatedWrapper
            onClick={onClick}
            key={key}
            elevation={selected ? 8 : 2}
            selected={selected}
            style={{
              transform: interpolate([y], y => `translate3d(0,${y}px,0)`)
            }}
          >
            <RepositoryInfo
              // onClick={handleClick(key)}
              src={groups[key].avatarUrl}
              name={key}
              url={groups[key].repoUrl}
              stars={groups[key].stars}
            />
            <Divider />
            <Collapse in={selected} timeout="auto" unmountOnExit>
              <SimpleList items={groups[key]} />
            </Collapse>
          </AnimatedWrapper>
        );
      })}
    </div>
  );
};
