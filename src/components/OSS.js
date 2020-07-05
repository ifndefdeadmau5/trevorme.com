import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";
import styled from "styled-components";
import axios from "axios";
import Transition from "react-transition-group/Transition";
import TransitionGroup from "react-transition-group/TransitionGroup";
import anime from "animejs";
import RepositoryInfo from "../components/RepositoryInfo";
import ContentLoader from "../components/ContentLoader";

import SimpleList from "./SimpleList";

const Root = styled.div({
  marginTop: 64,
  minWidth: 800,
});

const Wrapper = styled(Paper)(({ theme, selected }) => ({
  marginBottom: 24,
  width: 800,
  transition: theme.transitions.create(["box-shadow", "transform"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
}));

const USER_NAME = "ifndefdeadmau5";

const createOpacityAnimationConfig = (animatingIn) => ({
  value: animatingIn ? [0, 1] : 0,
  easing: "linear",
  duration: 300,
});

const ANIMATION_DONE_EVENT = "animation::done";

const triggerAnimationDoneEvent = (node) =>
  node.dispatchEvent(new Event(ANIMATION_DONE_EVENT));

const easing = 'spring(1, 150, 10)';

const animateRepoIn = (repo) =>
  anime
    .timeline()
    .add({
      targets: repo,
      translateX: [2000, 0],
      opacity: createOpacityAnimationConfig(true),
      easing,
    })
    .add(
      {
        targets: repo.querySelectorAll(".card"),
        easing,
        opacity: createOpacityAnimationConfig(true),
        translateY: [100, 0],
        complete: () => triggerAnimationDoneEvent(repo),
        delay: anime.stagger(35),
      },
      "-=1000"
    );

export default ({ className }) => {
  const [groups, setGroups] = useState(null);
  const [openID, setOpenID] = useState(null);

  async function fetchData() {
    const {
      data: { items },
    } = await axios.get(
      "https://api.github.com/search/issues?q=type:pr+repo:mbrn/material-table+repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+repo:mdx-js/mdx+author:ifndefdeadmau5"

      // Below uses github's new search api(commits)
      // "https://api.github.com/search/commits?q=repo:mui-org/material-ui+repo:facebookincubator/fbt+repo:chenglou/react-motion+repo:milesj/aesthetic+author:ifndefdeadmau5",
      // { headers: { accept: "application/vnd.github.cloak-preview" } }

      // Below searches all PR contributions among public repositories except mines
      // `https://api.github.com/search/issues?q=type:pr+is:public+author:${USER_NAME}+-user:${USER_NAME}`,
    );

    const groups = items.reduce((acc, curr) => {
      const key = "repository_url";
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

  const handleClick = (key) => (event) => {
    if (key === openID) {
      setOpenID(null);
    } else {
      setOpenID(key);
    }
  };

  return (
    <Root className={className}>
      {groups ? (
        Object.keys(groups).map((key, i, { length }) => {
          const selected = key === openID;
          return (
            <Transition in={selected} timeout={500} onEnter={animateRepoIn}>
              {(state) => (
                <Wrapper
                  key={key}
                  elevation={selected ? 8 : 0}
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
              )}
            </Transition>
          );
        })
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
