import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ContentLoader from '../components/ContentLoader';
import RepoList from './RepoList';
import { blue } from '@material-ui/core/colors';


const Root = styled.div({
  marginTop: 64,
  display: 'flex',
  justifyContent: 'center',
});



const USER_NAME = 'wojtekmaj';

export default ({ className }) => {
  const [groups, setGroups] = useState(null);

  async function fetchData() {
    const {
      data: { items },
    } = await axios.get(
      // 'https://api.github.com/search/issues?q=type:pr+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+repo:mdx-js/mdx+author:ifndefdeadmau5',
      // 'https://api.github.com/search/issues?q=type:pr+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5',
      // 'https://api.github.com/search/commits?q=type:pr+is:merged+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5', { headers: { accept: 'application/vnd.github.cloak-preview' } }
      // Below uses github's new search api
      // 'https://api.github.com/search/commits?q=repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5', { headers: { accept: 'application/vnd.github.cloak-preview' } }

      // Below searches all PR contributions among public repositories except mines
      `https://api.github.com/search/issues?q=type:pr+is:public+author:${USER_NAME}+-user:${USER_NAME}`,
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
        <RepoList groups={groups} />
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
