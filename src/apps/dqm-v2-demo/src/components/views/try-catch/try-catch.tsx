import type { FC, PropsWithChildren, ReactNode } from "react";
import type {
  TryCatch,
  TryCatchFail,
  TryCatchSuccess,
} from "@dqm/package-dqm-v2-debug";
import { Typography } from "antd";

interface TryCatchProps<T> {
  item: TryCatch<T> | undefined;
  Undefined?: FC;
  Fail?: FC<TryCatchViewFailProps>;
  Success?: TryCatchViewSuccessComponent;
}

// ANKI
type TryCatchViewComponent = <T>(props: TryCatchProps<T>) => ReactNode;

export const TryCatchView: TryCatchViewComponent = ({
  item,
  Fail = TryCatchViewFail,
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
        case undefined:
          return <TryCatchViewUnfavorable>(undefined)</TryCatchViewUnfavorable>;
        case null:
          return <TryCatchViewUnfavorable>(null)</TryCatchViewUnfavorable>;
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

type TryCatchViewSuccessProps<T> = {
  item: TryCatchSuccess<T>;
};

type TryCatchViewSuccessComponent = <T>(
  props: TryCatchViewSuccessProps<T>,
) => ReactNode;

const TryCatchViewSuccess: TryCatchViewSuccessComponent = ({ item }) => {
  return <span>{String(item.value)}</span>;
};
