import React from 'react';
import ContentLoader from 'react-content-loader';

export default props => (
  <ContentLoader
    height={160}
    width={400}
    speed={1}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="0.56" y="56.61" rx="0" ry="0" width="391" height="109.2" />
    <rect x="-0.44" y="18.61" rx="0" ry="0" width="392" height="20" />
  </ContentLoader>
);
