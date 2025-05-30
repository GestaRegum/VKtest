declare module "react-infinite-scroll-component" {
  import * as React from "react";

  interface InfiniteScrollProps {
    dataLength: number;
    next: () => void;
    hasMore: boolean;
    loader?: React.ReactNode;
    endMessage?: React.ReactNode;
    scrollThreshold?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
    inverse?: boolean;
    scrollableTarget?: string | HTMLElement;
    children: React.ReactNode;
  }

  export default class InfiniteScroll extends React.Component<InfiniteScrollProps> {}
}
