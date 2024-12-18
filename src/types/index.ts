export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface VideoData {
  videoId: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  tension: number;
  url: string;
}

export interface SearchResult {
  query: string;
  timestamp: number;
  results: VideoData[];
} 