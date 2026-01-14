import type {
  AnkiDistStore,
  ColorSchemes,
} from "_stores/anki-dist/anki.store.types.mjs";
import { Button, Input, Typography } from "antd";
import type { FC } from "react";
import { getAspect, getAspectText } from "./utils.mts";
import style from "./AnkiRenderSettings.module.css";

type AnkiRenderSettingsProps = {
  aspectRatios: string[];
  scales: string[];
  colorSchemes: ColorSchemes[];
  store: AnkiDistStore;
};

export const AnkiRenderSettings: FC<AnkiRenderSettingsProps> = ({
  aspectRatios,
  scales,
  colorSchemes,
  store,
}) => {
  return (
    <div className={style.container}>
      <Typography>Orientation & Aspect</Typography>
      {aspectRatios
        .map((a) => ({
          a,
          f: getAspect(a),
        }))
        .map(({ a, f }) => (
          <Button
            onClick={() => store.setPreviewAspect(f)}
            type={f === store.previewAspect ? "primary" : "default"}
          >
            {getAspectText(a, f)}
          </Button>
        ))}
      <Typography>Scale</Typography>
      {scales.map((s) => (
        <Button
          key={s}
          onClick={() => store.setPreviewScale(+s)}
          type={+s === store.previewScale ? "primary" : "default"}
        >
          {s}
        </Button>
      ))}
      <Typography>Color scheme</Typography>
      {colorSchemes.map((s) => (
        <Button
          key={s}
          onClick={() => store.setColorScheme(s)}
          type={s === store.colorScheme ? "primary" : "default"}
        >
          {s}
        </Button>
      ))}
      <Typography>Template Config</Typography>
      <Input.TextArea
        className={style.textarea}
        autoSize
        onChange={(e) => store.setTemplateConfig(e.target.value)}
        value={store.templateConfig}
      />
      <Typography>Card Config</Typography>
      <Input.TextArea
        className={style.textarea}
        autoSize
        onChange={(e) => store.setCardConfig(e.target.value)}
        value={store.cardConfig}
      />
    </div>
  );
};
