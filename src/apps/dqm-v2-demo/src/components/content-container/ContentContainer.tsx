import { SanitizedNodeList } from "../sanitized-node-list/SanitizedNodeList";

import { Outlet } from "@tanstack/react-router";

export const ContentContainer = () => {
  return (
    <Outlet>
      <SanitizedNodeList />
    </Outlet>
  );
};
