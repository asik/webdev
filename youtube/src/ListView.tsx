import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { RC } from "./common";
import { Link as RouterLink } from "react-router-dom";
import results from "./data/search.json";
import channels from "./data/channels.json";
import videos from "./data/videos.json";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import grey from "@material-ui/core/colors/grey";
import { SearchItem } from "./Api";
import { decode } from "he";
import { formatDistance, parseISO } from "date-fns";
import { intervalToDuration } from "date-fns/esm";
const addDuration = require("date-fns-duration");

const useStyles = makeStyles(() => ({
  avatar: {
    width: "32px",
    // height: "32px", // TODO override this globally since all avatars are 32x32
  },
  cardContainer: {
    display: "grid",
    alignItems: "start",
    gridTemplateRows: "[thumbnail] min-content [details] min-content",
    gap: "12px",
    width: "100%",
    maxWidth: "365px",
  },
  thumbnailContainer: {
    // Force thumbnail and overlays in the same grid cell
    gridRow: "thumbnail",
    gridColumn: 1,
  },
  cardDetailsContainer: {
    display: "grid",
    gridRow: "details",
    gridAutoFlow: "column",
    gap: "12px",
  },
  cardDetailsSubContainer: {
    display: "grid",
    gridAutoFlow: "column",
    alignItems: "start",
  },
  cardDetailsSubSubContainer: {
    display: "grid",
    gridAutoFlow: "row",
    alignItems: "start",
    gap: "6px",
  },
  cardDetailsTitle: {
    fontWeight: 500,
    maxHeight: "42px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    // Unfortunately CSS ellipsis only works for single-line text.
    // This solution is not standard, but works on Chrome and Firefox.
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    display: "-webkit-box",
  },
  cardDetails: {
    color: grey[700],
  },
  cardDetailsMetadata: {
    "& span:not(:last-of-type)::after": {
      content: '"•"',
      margin: "0px 4px",
    },
  },
  videoThumbnailImage: {
    // change the display mode because otherwise there's a gap (this is insane)
    // https://stackoverflow.com/questions/5804256/image-inside-div-has-extra-space-below-the-image
    display: "block",
    width: "100%",
    objectFit: "contain",
  },
  moreButton: {
    padding: 0,
  },
}));

function formatViewNumber(views: number): string {
  const numDecimals = 1;
  for (const { bound, marker } of [
    { bound: 1_000_000_000, marker: "G" },
    { bound: 1_000_000, marker: "M" },
    { bound: 1_000, marker: "k" },
  ]) {
    if (views >= bound) {
      let numberAsString = `${(views / bound).toFixed(numDecimals)}`;
      if (
        numberAsString.length > numDecimals + 2 ||
        numberAsString.endsWith("0")
      ) {
        numberAsString = numberAsString.substring(
          0,
          numberAsString.length - (numDecimals + 1)
        );
      }
      return `${numberAsString} ${marker}`;
    }
  }
  return views.toString();
}
/**
 * Generates a number of views with a "nice", "realistic" distribution
 * */
// function generateNumberOfViews(): number {
//   function generateRandomInRange(min: number, max: number): number {
//     return Math.random() * (max - min) + min;
//   }

//   const power = generateRandomInRange(2, 9);
//   return Math.floor(generateRandomInRange(0.1, 0.99) * Math.pow(10, power));
// }

function getNumberOfViews(videoId: string): number {
  const viewCount = videos.items.find((i) => i.id === videoId)?.statistics
    .viewCount;
  return viewCount == null ? 0 : Number(viewCount);
}

function getDuration(videoId: string): string {
  const durationString =
    videos.items.find((i) => i.id === videoId)?.contentDetails.duration ?? "";
  // date-fns doesn't yet provide an API for parsing ISO8601 durations, (https://github.com/date-fns/date-fns/pull/1947)
  // so we do this in a roundabout way using an unofficial package (https://github.com/pke/date-fns-duration)
  // TODO checkout https://www.npmjs.com/package/@js-joda/core
  const referenceDate = new Date();
  const duration = intervalToDuration({
    start: referenceDate,
    end: addDuration(referenceDate, durationString),
  });
  if (duration.hours != null && duration.hours > 0) {
    return `${duration.hours}:${duration.minutes}:${duration.seconds}`;
  }
  return `${duration.minutes}:${duration.seconds}`;
}

function SearchResultCard({ id, snippet }: SearchItem): RC {
  const videoThumbnail = snippet.thumbnails.medium;
  const channelThumbnail = channels.items.find(
    (c) => c.id === snippet.channelId
  )?.snippet.thumbnails.default;
  const classes = useStyles();
  const [numViews] = useState(getNumberOfViews(id.videoId));
  const [duration] = useState(getDuration(id.videoId));
  return (
    <Link
      color="inherit"
      underline="none"
      component={RouterLink}
      to={`/watch?v=${id.videoId}`}
      className={classes.cardContainer}
    >
      <div className={classes.thumbnailContainer}>
        <img
          className={classes.videoThumbnailImage}
          alt={"video thumbnail"}
          src={videoThumbnail.url}
        />
      </div>
      <div className={classes.thumbnailContainer}>
        <span>{duration}</span>
      </div>
      <div className={classes.cardDetailsContainer}>
        <Avatar
          classes={{ root: classes.avatar }}
          src={channelThumbnail?.url}
        />
        <div className={classes.cardDetailsSubContainer}>
          <div className={classes.cardDetailsSubSubContainer}>
            <Typography
              component={"h3"}
              variant="body2"
              className={classes.cardDetailsTitle}
            >
              {decode(snippet.title)}
            </Typography>
            <div className={classes.cardDetails}>
              <Typography component={"span"} variant="body2">
                {snippet.channelTitle}
              </Typography>
              <div className={classes.cardDetailsMetadata}>
                <Typography component={"span"} variant="body2">
                  {`${formatViewNumber(numViews)} views`}
                </Typography>
                <Typography component={"span"} variant="body2">
                  {`${formatDistance(
                    new Date(snippet.publishedAt),
                    new Date()
                  )} ago`}
                </Typography>
              </div>
            </div>
          </div>
          <IconButton className={classes.moreButton}>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
    </Link>
  );
}

export function ListView(): RC {
  useEffect(() => {
    console.log(parseISO("PT24M48S"));
    console.log(results.items.map((item) => item.id.videoId).join(","));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#FAFAFA",
        display: "grid",
        // YouTube actually maxes at 6 columns; this will create indefinitely many,
        // so it's not perfect.
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        justifyItems: "center",
        columnGap: "12px",
        rowGap: "40px",
        padding: "16px",
      }}
    >
      {results.items.map(SearchResultCard)}
    </div>
  );
}
