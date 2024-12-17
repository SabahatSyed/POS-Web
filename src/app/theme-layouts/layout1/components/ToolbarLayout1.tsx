import { ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import Toolbar from "@mui/material/Toolbar";
import clsx from "clsx";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectFuseCurrentLayoutConfig,
  selectToolbarTheme,
} from "app/store/fuse/settingsSlice";
import { selectFuseNavbar } from "app/store/fuse/navbarSlice";
import { Layout1ConfigDefaultsType } from "app/theme-layouts/layout1/Layout1Config";
import AdjustFontSize from "../../shared-components/AdjustFontSize";
import FullScreenToggle from "../../shared-components/FullScreenToggle";
import LanguageSwitcher from "../../shared-components/LanguageSwitcher";
import NotificationPanelToggleButton from "../../shared-components/notificationPanel/NotificationPanelToggleButton";
import NavigationShortcuts from "../../shared-components/NavigationShortcuts";
import NavigationSearch from "../../shared-components/NavigationSearch";
import NavbarToggleButton from "../../shared-components/NavbarToggleButton";
import UserMenu from "../../shared-components/UserMenu";
import QuickPanelToggleButton from "../../shared-components/quickPanel/QuickPanelToggleButton";
import { Avatar, Input, Paper } from "@mui/material";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

type ToolbarLayout1Props = {
  className?: string;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
  const { className } = props;
  const [searchText, setSearchText] = useState("");

  const config = useSelector(
    selectFuseCurrentLayoutConfig
  ) as Layout1ConfigDefaultsType;
  const navbar = useSelector(selectFuseNavbar);
  const toolbarTheme = useSelector(selectToolbarTheme);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx("relative z-20 flex shadow-md", className)}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? toolbarTheme.palette.background.paper
              : toolbarTheme.palette.background.default,
        }}
        position="static"
      >
        <Toolbar className="min-h-48 p-0 md:min-h-64">
          <div className="flex flex-1 items-center px-16">
            {config.navbar.display && config.navbar.position === "left" && (
              <>
                <Hidden lgDown>
                  {(config.navbar.style === "style-3" ||
                    config.navbar.style === "style-3-dense") && (
                    <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
                  )}

                  {config.navbar.style === "style-1" && !navbar.open && (
                    <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
                  )}
                </Hidden>

                <Hidden lgUp>
                  <NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
                </Hidden>
              </>
            )}

            {/* <Hidden lgDown>
							 <NavigationShortcuts />
            </Hidden> */}
            {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
              <Paper
                component={motion.div}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-none border-1 shadow-0"
              >
                <FuseSvgIcon color="disabled">
                  heroicons-solid:search
                </FuseSvgIcon>

                <Input
                  placeholder="Search"
                  className="flex flex-1"
                  disableUnderline
                  fullWidth
                  value={searchText}
                  onChange={(ev) => setSearchText(ev.target.value)}
                  inputProps={{
                    "aria-label": "Search",
                  }}
                  // onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  // 	//dispatch(setProductsSearchText(ev.target.value))
                  // }
                />
              </Paper>
            </div> */}
            <div className="flex items-center sm:mx-8 space-x-12">
              <Avatar
                className="md:mx-4"
                alt="user photo"
                // src={user.data.photoURL}
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
              />
            </div>
          </div>

          <div className="flex h-full items-center overflow-x-auto px-8">
            {/* <LanguageSwitcher /> */}
            {/* <AdjustFontSize /> */}
            <div className="flex items-center sm:mx-8 space-x-12">
              <Paper
                component={motion.div}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                className="flex items-center rounded-none border-1 shadow-0 w-full sm:w-[200px] md:w-[300px] lg:w-[300px] min-w-[100px]"
              >
                <FuseSvgIcon className="mx-4" size={20} color="disabled">
                  heroicons-solid:search
                </FuseSvgIcon>

                <Input
                  placeholder="Search"
                  className="flex flex-1 px-2 py-1"
                  disableUnderline
                  value={searchText}
                  onChange={(ev) => setSearchText(ev.target.value)}
                  inputProps={{
                    "aria-label": "Search",
                  }}
                />
              </Paper>
            </div>

            <FullScreenToggle />
            {/* <NavigationSearch /> */}
            {/* <QuickPanelToggleButton /> */}
            <NotificationPanelToggleButton />
            <UserMenu />
          </div>

          {config.navbar.display && config.navbar.position === "right" && (
            <>
              <Hidden lgDown>
                {!navbar.open && (
                  <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
                )}
              </Hidden>

              <Hidden lgUp>
                <NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
              </Hidden>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout1);
