import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import axios from 'axios';
import ContentLoader from '../components/ContentLoader';

import SimpleList from './SimpleList';


const Root = styled.div({
  marginTop: 64,
});

const MarginedDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const USER_NAME = 'ifndefdeadmau5';

export default ({ className }) => {
  const [groups, setGroups] = useState(null);

  async function fetchData() {
    const {
      data: { items },
    } = await axios.get(
      'https://api.github.com/search/issues?q=type:pr+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5',

      // Below searches all PR contributions among public repositories except mines
      // `https://api.github.com/search/issues?q=type:pr+is:public+author:${USER_NAME}+-user:${USER_NAME}`,
    );

    const groups = items.reduce((acc, curr) => {
      const key = 'repository_url';
      const group = acc[curr[key]];
      const item = {
        text: curr.title.trim(),
        link: curr.html_url,
      };
      return {
        ...acc,
        [curr[key]]: group ? [...group, item] : [item],
      };
    }, {});

    setGroups(groups);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Root className={className}>
      <Typography variant="subtitle1">
        These are all the OSS contributions I've been made so far
      </Typography>
      {groups ? (
        Object.keys(groups).map((key, i, { length }) => (
          <React.Fragment key={key}>
            <Typography variant="h3" gutterBottom>
              {key.substring(29)}
            </Typography>
            {<SimpleList items={groups[key]} />}
            {length - 1 !== i && <MarginedDivider />}
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>{
          Array.from({ length: 5 }).map((v, i) => <ContentLoader key={i} />)
        }</React.Fragment>
      )}
    </Root>
  );
};
