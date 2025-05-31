declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;
  export default ReactComponent;
}

declare module "*.jpg";

declare module "*.png";

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
