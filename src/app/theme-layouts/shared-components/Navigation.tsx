import FuseNavigation from '@fuse/core/FuseNavigation';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { selectNavigation, setNavigation } from 'app/store/fuse/navigationSlice';
import { selectUser } from 'app/store/user/userSlice'; // Ensure this is the correct selector for user data
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { navbarCloseMobile } from 'app/store/fuse/navbarSlice';
import { FuseNavigationProps } from '@fuse/core/FuseNavigation/FuseNavigation';

/**
 * Navigation
 */
function Navigation(props: Partial<FuseNavigationProps>) {
  const { className = '', layout = 'vertical', dense, active } = props;
  const navigation = useAppSelector(selectNavigation); // Get navigation from Redux
  const user = useAppSelector(selectUser); // Get user data from Redux
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg')); // Check for mobile view
  const dispatch = useAppDispatch();

  // Function to filter the navigation based on user's page access
  const filterNavigation = (navigation) => {
    if (!user || !user?.pageAccess) return []; // Return empty if no user or pageAccess
    if (user && user.role == "SuperAdmin") return navigation
    const pageAccess = user.pageAccess;  // The pageAccess array of objects
    // Function to check if the user has read access to a page id
    const hasReadAccess = (id: string) => {
      const access = pageAccess[id];
      return access ? access.read : false;
    };
    const isAllowedRoleAndCompanyType = (id: string) => {
      const allowedRoles = ['Admin', 'Employee'];
      const allowedCompanyTypes = ['optics', 'tailor'];
      const isEndpoint = id === 'keypoints';
      if (isEndpoint) {
        return allowedRoles.includes(user?.role) && allowedCompanyTypes.includes(user.companyType.toLowerCase());
      }
      return true;
    };
    // Function to filter navigation items
    return navigation.map(item => {

      if (!isAllowedRoleAndCompanyType(item.id)) {
        return null;
      }
      // If the item requires a role and the user doesn't have access, exclude it
      if (item.auth && !item.auth.includes(user.role)) {
        return null; // Exclude this item
      }

      // If the item has children, filter those based on user access
      if (item.children) {
        item.children = item.children.filter(child => hasReadAccess(child.id)); // Check if the user has read access for the child item
      }

      return item;
    }).filter(item => item !== null); // Remove any null items
  };


  // UseEffect to trigger filtering and update the Redux store
  useEffect(() => {
    const filteredNav = filterNavigation(navigation); // Get the filtered navigation
    dispatch(setNavigation(filteredNav)); // Set filtered navigation in Redux
  }, []); // Run when user or navigation changes

  const handleItemClick = () => {
    if (isMobile) {
      dispatch(navbarCloseMobile());
    }
  };

  return (
    <FuseNavigation
      className={clsx('navigation flex-1', className)}
      navigation={navigation}  // The navigation will now be updated from Redux store
      layout={layout}
      dense={dense}
      active={active}
      onItemClick={handleItemClick}
      checkPermission
    />
  );
}

export default Navigation;
