import { DisplayContainer } from "_layouts/display-container/ContentContainer";
import { MenuDrawer } from "_layouts/menu-drawer/MenuDrawer";
import { NarrowDrawer } from "_layouts/narrow-drawer/NarrowDrawer";
import { TitleBarNarrow } from "_layouts/title-bar/TitleBar";
import { Scroller } from "_views/scroller/Scroller";

import style from "./NarrowLayout.module.css";

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
