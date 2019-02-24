import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const StyledListItemText = styled(ListItemText)({
  whiteSpace: 'pre-wrap',
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default props => {
  const { items } = props;
  return (
    <Paper>
      <List component="nav">
        {items.map(({ text, link }) => (
          <ListItemLink key={link} href={link}>
            <StyledListItemText primary={text} />
          </ListItemLink>
        ))}
      </List>
    </Paper>
  );
};
