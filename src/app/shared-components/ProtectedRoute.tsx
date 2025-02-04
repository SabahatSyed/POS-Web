import React from 'react';
import { Navigate } from 'react-router-dom';
import usePageAccess from '../hooks/userPageAccess';

const ProtectedRoute = ({ pageId, children }: { pageId: string; children: JSX.Element }) => {
  const { hasReadAccess } = usePageAccess();
  if (!hasReadAccess(pageId)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;