import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';
import axios from 'axios';
import RepositoryInfo from '../components/RepositoryInfo';
import ContentLoader from '../components/ContentLoader';

import SimpleList from './SimpleList';

const Root = styled.div({
  marginTop: 64,
});

const Wrapper = styled(Paper)(({ theme }) => ({
  marginBottom: 24,
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
}));

const MarginedDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
}));

const USER_NAME = 'ifndefdeadmau5';

export default ({ className }) => {
  const [groups, setGroups] = useState(null);
  const [openID, setOpenID] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  async function fetchData() {
    const {
      data: { items },
    } = await axios.get(
      'https://api.github.com/search/issues?q=type:pr+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5',
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

  const handleRepoClick = key => event => {
    if (key === openID) {
      console.log('clicked same item');
      setOpenID(null);
    }
    setOpenID(key);
  };

  return (
    <Root className={className}>
      <Typography variant="subtitle1">
        These are all the OSS contributions I've been made so far
      </Typography>
      {groups ? (
        Object.keys(groups).map((key, i, { length }) => (
          <React.Fragment key={key}>
            <Wrapper
              // onMouseEnter={() => setIsHovering(true)}
              // onMouseLeave={() => setIsHovering(false)}
              // elevation={key === openID && isHovering ? 8 : 2}
              elevation={key === openID ? 8 : 2}
            >
              <RepositoryInfo
                onClick={handleRepoClick(key)}
                src={groups[key].avatarUrl}
                name={key}
                url={groups[key].repoUrl}
                stars={groups[key].stars}
              />
              <Divider />
              <Collapse in={key === openID} timeout="auto" unmountOnExit>
                <SimpleList items={groups[key]} />
              </Collapse>
              {/* {length - 1 !== i && <MarginedDivider />} */}
            </Wrapper>
          </React.Fragment>
        ))
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
