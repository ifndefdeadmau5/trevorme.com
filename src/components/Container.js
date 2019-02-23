import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

export default ({ className }) => {
  return (
    <div className={className}>
      <Typography>
        {Array.apply(null, Array(50))
          .map(
            () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
          )
          .join('\n')}
      </Typography>
    </div>
  );
};
