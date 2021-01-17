import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";

import { RC, Urls } from "./common";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import makeStyles from "@material-ui/core/styles/makeStyles";
import grey from "@material-ui/core/colors/grey";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    color: (props: { isSelected: boolean }) =>
      props.isSelected ? theme.palette.secondary.main : grey[700],
    borderRadius: 0,
  },
}));

function ShortButton(props: {
  icon: JSX.Element;
  title: string;
  isSelected: boolean;
  onClick: () => void;
}): RC {
  const classes = useStyles(props);
  return (
    <IconButton
      disableRipple
      className={classes.iconButton}
      onClick={() => {
        props.onClick();
      }}
    >
      <div>
        {props.icon}
        <Typography variant="subtitle1">{props.title}</Typography>
      </div>
    </IconButton>
  );
}

export function SideMenu(): RC {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const theme = useTheme();
  // TODO use this to trigger the larger menu when the larger menu is done
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const buttons: { icon: JSX.Element; title: string; url: Urls }[] = [
    { icon: <HomeIcon />, title: "Home", url: "/" },
    { icon: <WhatshotIcon />, title: "What's hot", url: "/feed/trending" },
    {
      icon: <SubscriptionsIcon />,
      title: "Subscriptions",
      url: "/feed/subscriptions",
    },
    { icon: <VideoLibraryIcon />, title: "Library", url: "/feed/library" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${buttons.length}, 74px) auto`,
      }}
    >
      {buttons.map(({ icon, title, url }) => (
        <ShortButton
          icon={icon}
          title={title}
          isSelected={pathname === url}
          onClick={() => {
            push(url);
          }}
        />
      ))}
    </div>
  );
}
