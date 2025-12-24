import type { FC, ReactNode } from "react";
import type {
  TryCatch,
  TryCatchFail,
  TryCatchSuccess,
} from "../../../utils/utils.mts";

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
  Undefined = TryCatchViewUndefined,
}) => {
  if (!item) {
    return <Undefined />;
  }
  switch (item.state) {
    case "fail":
      return <Fail item={item} />;
    case "success":
      return <Success item={item} />;
  }
};

interface TryCatchViewFailProps {
  item: TryCatchFail;
}

const TryCatchViewFail: FC<TryCatchViewFailProps> = ({ item }) => {
  console.log("component:TryCatchViewFail", item);
  return <span>(failed)</span>;
};

const TryCatchViewUndefined: FC = () => {
  return <span>(undefined)</span>;
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
