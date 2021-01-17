export type SearchResult = {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items?: (SearchItem)[] | null;
}
export type SearchItem = {
  kind: string;
  etag: string;
  id: Id;
  snippet: SearchSnippet;
}
export type Id = {
  kind: string;
  videoId: string;
}
export type SearchSnippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}
export type Thumbnails = {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
}
export type Thumbnail = {
  url: string;
  width: number;
  height: number;
}
export type ChannelsResult = {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items?: (ItemsEntity)[] | null;
}
export type PageInfo = {
  totalResults: number;
  resultsPerPage: number;
}
export type ItemsEntity = {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
}
export type Snippet = {
  title: string;
  description: string;
  customUrl?: string | null;
  publishedAt: string;
  thumbnails: Thumbnails;
  localized: Localized;
  country?: string | null;
  defaultLanguage?: string | null;
}
export type Localized = {
  title: string;
  description: string;
}

