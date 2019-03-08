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

const fn = order => (index, a, b) => {
  const y = order.indexOf(index) === 0 ? 0 : -90 + order.indexOf(index) * 90;
  const x = order.indexOf(index) === 0 ? 520 : 0;
  return { y, x, immediate: false };
};

const Root = styled.div({
  marginTop: 64,
  // minWidth: 800,
});

const ListRoot = styled.div({
  position: 'relative',
  width: '100%',
});

const Wrapper = styled(Paper)(({ theme, selected }) => ({
  marginBottom: 24,
  position: 'absolute',
  width: 500,
}));

const AnimatedWrapper = animated(Wrapper);

const USER_NAME = 'ifndefdeadmau5';

export default ({ className }) => {
  const [groups, setGroups] = useState(null);

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

  return (
    <Root className={className}>
      {groups ? (
        <List groups={groups} />
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
    <ListRoot>
      {springs.map(({ y, x }, i, { length }) => {
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
            }}
          >
            <RepositoryInfo
              onClick={onClick(key)}
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
    </ListRoot>
  );
};
