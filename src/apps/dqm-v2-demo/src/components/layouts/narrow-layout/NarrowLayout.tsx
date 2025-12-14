import { DisplayContainer } from "_layouts/display-container/ContentContainer";
import { NarrowDrawer } from "_layouts/narrow-drawer/NarrowDrawer";
import { Scroller } from "_views/scroller/Scroller";
import { TitleBarNarrow } from "../../title-bar/TitleBar";
import style from "./NarrowLayout.module.css";

export const NarrowLayout = () => {
  return (
    <Scroller direction="vertical">
      <div className={style.mobile}>
        <TitleBarNarrow />
        <DisplayContainer />
        <NarrowDrawer />
      </div>
    </Scroller>
  );
};
