import { DisplayContainer } from "_layouts/display-container/ContentContainer";
import { NarrowDrawer } from "_layouts/narrow-drawer/NarrowDrawer";
import { Scroller } from "_views/scroller/Scroller";
import { TitleBarNarrow } from "_layouts/title-bar/TitleBar";
import style from "./NarrowLayout.module.css";
import { MenuDrawer } from "_layouts/menu-drawer/MenuDrawer";

export const NarrowLayout = () => {
  return (
    <>
      <Scroller direction="vertical">
        <div className={style.mobile}>
          <TitleBarNarrow isAbsolute={true} />
          <DisplayContainer />
          <NarrowDrawer />
        </div>
      </Scroller>
      <MenuDrawer />
    </>
  );
};
