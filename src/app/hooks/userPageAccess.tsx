import { useSelector } from "react-redux";
import { selectUser } from "app/store/user/userSlice";

const usePageAccess = () => {
    let user={};
  if (selectUser) {
     user = useSelector(selectUser) || {};
  }

  const hasReadAccess = (pageId: string) => {
    return user?.pageAccess?.[pageId]?.read || false;
  };

  const hasAddAccess = (pageId: string) => {
    return user?.pageAccess?.[pageId]?.add || false;
  };

  const hasUpdateAccess = (pageId: string) => {
    return user?.pageAccess?.[pageId]?.update || false;
  };

  const hasDeleteAccess = (pageId: string) => {
    return user?.pageAccess?.[pageId]?.delete || false;
  };

  return { hasReadAccess, hasAddAccess, hasUpdateAccess, hasDeleteAccess };
};

export default usePageAccess;
