import type {
  TryCatch,
  TryCatchFail,
  TryCatchSuccess,
} from "@dqm/package-dqm-v2-debug";
import type { FC, PropsWithChildren, ReactNode } from "react";

import { Typography } from "antd";

interface TryCatchProps<T> {
  Fail?: FC<TryCatchViewFailProps>;
  item: TryCatch<T> | undefined;
  Success?: TryCatchViewSuccessComponent;
  Undefined?: FC;
}

// ANKI
type TryCatchViewComponent = <T>(props: TryCatchProps<T>) => ReactNode;

export const TryCatchView: TryCatchViewComponent = ({
  Fail = TryCatchViewFail,
  item,
  Success = TryCatchViewSuccess,
  Undefined = TryCatchViewUnfavorable,
}) => {
  if (!item) {
    return <Undefined />;
  }
  switch (item.state) {
    case "fail":
      return <Fail item={item} />;
    case "success":
      switch (item.value) {
        case null:
          return <TryCatchViewUnfavorable>(null)</TryCatchViewUnfavorable>;
        case undefined:
          return <TryCatchViewUnfavorable>(undefined)</TryCatchViewUnfavorable>;
        default:
          return <Success item={item} />;
      }
  }
};

interface TryCatchViewFailProps {
  item: TryCatchFail;
}

const TryCatchViewFail: FC<TryCatchViewFailProps> = ({ item }) => {
  console.log("component:TryCatchViewFail", item);
  return <TryCatchViewUnfavorable>(failed)</TryCatchViewUnfavorable>;
};

const TryCatchViewUnfavorable: FC<PropsWithChildren> = ({ children }) => {
  return <Typography.Text type="secondary">{children}</Typography.Text>;
};

type TryCatchViewSuccessComponent = <T>(
  props: TryCatchViewSuccessProps<T>,
) => ReactNode;

type TryCatchViewSuccessProps<T> = {
  item: TryCatchSuccess<T>;
};

const TryCatchViewSuccess: TryCatchViewSuccessComponent = ({ item }) => {
  return <span>{String(item.value)}</span>;
};
