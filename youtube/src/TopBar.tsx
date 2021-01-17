import React, { CSSProperties, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AppsIcon from "@material-ui/icons/Apps";
import NotificationsIcon from "@material-ui/icons/Notifications";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import YouTubeIcon from "@material-ui/icons/YouTube";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import { RC, Urls } from "./common";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router-dom";
import grey from "@material-ui/core/colors/grey";

const useAppBarButtonStyles = makeStyles(() => ({
  iconButton: {
    color: grey[700],
  },
}));
export function AppBarButton(props: {
  tooltip?: string;
  link?: Urls;
  icon: JSX.Element;
}): RC {
  const classes = useAppBarButtonStyles();
  const { push } = useHistory();
  const button = (
    <IconButton
      className={classes.iconButton}
      onClick={() => {
        if (props.link != null) {
          push(props.link);
        }
      }}
    >
      {props.icon}
    </IconButton>
  );
  return props.tooltip != null ? (
    <Tooltip title={props.tooltip}>{button}</Tooltip>
  ) : (
    button
  );
}
const useAppBarSearchStyles = makeStyles(() => {
  return {
    disableWebkitSearchDecorations: {
      "& input::-webkit-search-decoration, & input::-webkit-search-cancel-button": {
        display: "none",
      },
    },
  };
});
export function AppBarSearch(): RC {
  const classes = useAppBarSearchStyles();
  const [searchText, setSearchText] = useState("");
  return (
    <Box
      style={{
        display: "grid",
        gridAutoFlow: "column",
        alignItems: "center",
        gridTemplateColumns: "10% [input] auto [button] min-content 10%",
        width: "100%",
      }}
    >
      <Autocomplete
        style={{ gridColumn: "input" }}
        freeSolo
        options={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            style={{
              margin: "0px",
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value ?? "")}
            className={classes.disableWebkitSearchDecorations}
            size="small"
            label={searchText === "" ? "Search" : ""}
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: false,
              style: { transform: "translate(10px, 8px)" },
            }}
            InputProps={{
              ...params.InputProps,
              type: "search",
              endAdornment: null,
              style: {
                borderRadius: "0",
                padding: "1px 4px",
              },
            }}
          />
        )}
      />
      <Tooltip title="Search">
        <Button
          variant="outlined"
          style={{
            gridColumn: "button",
            borderRadius: "2px",
            padding: "0px",
            marginLeft: "-1px", // merge the button border into the search box border
            height: "100%",
            backgroundColor: grey[100],
            color: grey[600],
          }}
          type="submit"
        >
          <SearchIcon style={{ fontSize: "1.2rem" }} />
        </Button>
      </Tooltip>
    </Box>
  );
}

export function TopBar(): RC {
  const buttonRowStyles: CSSProperties = {
    display: "grid",
    gridAutoFlow: "column",
    columnGap: "8px",
    alignItems: "center",
    justifyItems: "center",
  };

  return (
    <AppBar
      position="static" // override MUI default "fixed"
      style={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateColumns: "min-content auto min-content",
          gridTemplateRows: "56px",
          justifyItems: "center",
          minHeight: "auto", // override MUI Toolbar minHeight
        }}
      >
        <div style={buttonRowStyles}>
          <AppBarButton icon={<MenuIcon />} />
          <AppBarButton
            link={"/"}
            icon={<YouTubeIcon style={{ color: "red" }} />}
            tooltip="YouTube Home"
          />
        </div>
        <AppBarSearch />
        <div style={buttonRowStyles}>
          <AppBarButton tooltip="Create" icon={<VideoCallIcon />} />
          <AppBarButton tooltip="YouTube Applications" icon={<AppsIcon />} />
          <AppBarButton tooltip="Notifications" icon={<NotificationsIcon />} />
          <Avatar style={{ width: "32px", height: "32px" }}>H</Avatar>
        </div>
      </Toolbar>
    </AppBar>
  );
}
