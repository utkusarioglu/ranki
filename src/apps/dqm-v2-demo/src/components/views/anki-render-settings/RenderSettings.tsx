import { CheckOutlined } from "@ant-design/icons";
import { Button, Input, Typography } from "antd";
import { type FC } from "react";

import style from "./AnkiRenderSettings.module.css";
import { computeAspect, getAspectText } from "./utils.mts";
import {
  FACES,
  FLAGS,
  CONTENT_TYPES,
  APP_VARIANTS,
} from "./RenderSettings.constants.mts";
import type { AnkiRenderSettingsProps } from "./AnkiRenderSettings.types.mts";
import { AnkiRenderFetchSettings } from "./RenderFetchSettings";

export const AnkiRenderSettings: FC<AnkiRenderSettingsProps> = ({
  aspectRatios,
  colorSchemes,
  scales,
  store,
}) => {
  return (
    <div className={style.container}>
      <Typography>App Variant</Typography>
      {APP_VARIANTS.map(({ title, variant }) => (
        <Button
          key={title}
          onClick={() => store.setAppVariant(variant)}
          type={store.appVariant === variant ? "primary" : "default"}
        >
          {title}
        </Button>
      ))}
      <AnkiRenderFetchSettings store={store} />

      <Typography>Content</Typography>
      {CONTENT_TYPES.map(({ contentType, title }) => (
        <Button
          key={title}
          onClick={() => store.setContentType(contentType)}
          type={store.contentType === contentType ? "primary" : "default"}
        >
          {title}
        </Button>
      ))}

      <Typography>Orientation & Aspect</Typography>
      {aspectRatios
        .map((a) => ({
          a,
          f: computeAspect(a),
        }))
        .map(({ a, f }) => (
          <Button
            key={a}
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

      <Typography>Face</Typography>
      {FACES.map((face) => (
        <Button
          key={face}
          onClick={() => store.setFace(face)}
          type={face === store.face ? "primary" : "default"}
        >
          {face}
        </Button>
      ))}

      <Typography>Flag</Typography>
      {FLAGS.map((flag) => (
        <Button
          key={flag.flag}
          onClick={() => store.setFlag(flag.flag)}
          style={{
            backgroundColor: flag.color,
            color: flag.flag === store.flag ? "#FFF" : "transparent",
          }}
        >
          <CheckOutlined />
        </Button>
      ))}

      <Typography>Type</Typography>
      <Input
        onChange={(e) => store.setCardType(e.target.value)}
        value={store.cardType}
      />

      <Typography>Card</Typography>
      <Input
        onChange={(e) => store.setCard(e.target.value)}
        value={store.card}
      />

      <Typography>Deck</Typography>
      <Input
        onChange={(e) => store.setDeck(e.target.value)}
        value={store.deck}
      />

      <Typography>Tags</Typography>
      <Input
        onChange={(e) => store.setTags(e.target.value)}
        value={store.tags}
      />

      <Typography>Card Config</Typography>
      <Input.TextArea
        autoSize
        className={style.textarea}
        onChange={(e) => store.setCardConfig(e.target.value)}
        value={store.cardConfig}
      />
    </div>
  );
};
