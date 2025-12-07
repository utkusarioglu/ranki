import { ContentContainer } from "../content-container/ContentContainer";
import { NarrowDrawer } from "../narrow-drawer/NarrowDrawer";
import { Scroller } from "../scroller/Scroller";
import { TitleBarNarrow } from "../title-bar/TitleBar";
import style from "./NarrowLayout.module.css";

export const NarrowLayout = () => {
  return (
    <Scroller direction="vertical">
      <div className={style.mobile}>
        <TitleBarNarrow />
        <ContentContainer />
        <NarrowDrawer />
      </div>
    </Scroller>
  );
};
