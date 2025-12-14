import { ContentContainer } from "../content/content-container/ContentContainer";
import { NarrowDrawer } from "../narrow-drawer/NarrowDrawer";
import { Scroller } from "../views/scroller/Scroller";
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
