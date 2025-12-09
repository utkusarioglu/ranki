import { Button, Typography } from "antd";
import { useUiStore } from "../../stores/ui/ui.store.mts";

export const RenderSettings = () => {
  const ui = useUiStore();

  return (
    <>
      <Typography>Orientation</Typography>
      <Button onClick={() => ui.setPreviewSize([512, 768])}>Portrait</Button>
      <Button onClick={() => ui.setPreviewSize([768, 512])}>Landscape</Button>
      <Typography>Scale</Typography>
      <Button onClick={() => ui.setPreviewScale(0.5)}>0.5</Button>
      <Button onClick={() => ui.setPreviewScale(0.75)}>0.75</Button>
      <Button onClick={() => ui.setPreviewScale(1)}>1</Button>
    </>
  );
};
