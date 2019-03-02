import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const StyledListItemText = styled(ListItemText)({
  whiteSpace: 'pre-wrap',
});

const StyledList = styled(List)({
  padding: 0,
})

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default props => {
  const { items, className } = props;
  return (
    <div className={className}>
      <StyledList component="nav">
        {items.map(({ text, link }, i, { length }) => (
          <React.Fragment key={link}>
            <ListItemLink href={link}>
              <StyledListItemText primary={text} />
            </ListItemLink>
            {length - 1 !== i && <Divider />}
          </React.Fragment>
        ))}
      </StyledList>
    </div>
  );
};
