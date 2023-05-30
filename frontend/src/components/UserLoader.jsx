import React from 'react';
import ContentLoader from 'react-content-loader';

const UserSkeleton = () => {
  return (
    <ContentLoader
      speed={1}
      width={180}
      height={60}
      viewBox="0 0 180 60"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="60" y="40" rx="3" ry="3" width="150" height="6" />
      <rect x="60" y="20" rx="4" ry="4" width="120" height="6" />
      <circle cx="24" cy="32" r="20" />
    </ContentLoader>
  );
};

export default UserSkeleton;
