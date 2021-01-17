import { ReactElement } from "react";

export type RC = ReactElement<any, any> | null;

export type Urls =
  | "/"
  | "/feed/trending"
  | "/feed/subscriptions"
  | "/feed/library"
  | "/watch?v="