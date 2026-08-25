import type {
  AnkiDistStore,
  ColorSchemes,
  RankiContentType,
  RankiFace,
  RankiFlag,
} from "_stores/anki-dist/anki.store.types.mjs";
import { Button, Input, Typography } from "antd";
import { type FC } from "react";
import { getAspect, getAspectText } from "./utils.mts";
import style from "./AnkiRenderSettings.module.css";
import { CheckOutlined } from "@ant-design/icons";

type AnkiRenderSettingsProps = {
  aspectRatios: string[];
  scales: string[];
  colorSchemes: ColorSchemes[];
  store: AnkiDistStore;
};

interface Flag {
  color: `#${string}` | "none";
  flag: RankiFlag;
}

const FLAGS: Flag[] = [
  {
    color: "none",
    flag: "flag0",
  },
  {
    color: "#FF0000",
    flag: "flag1",
  },
  {
    color: "#FF7700",
    flag: "flag2",
  },
  {
    color: "#00FF00",
    flag: "flag3",
  },
  {
    color: "#0000FF",
    flag: "flag4",
  },
  {
    color: "#e89eb8",
    flag: "flag5",
  },
  {
    color: "#40E0D0",
    flag: "flag6",
  },
  {
    color: "#BF40BF",
    flag: "flag7",
  },
];

const FACES: RankiFace[] = ["Q", "N"];

export const AnkiRenderSettings: FC<AnkiRenderSettingsProps> = ({
  aspectRatios,
  scales,
  colorSchemes,
  store,
}) => {
  return (
    <div className={style.container}>
      <Typography>App Variant</Typography>
      {[
        {
          title: "Core",
          variant: "core" as const,
        },
        {
          title: "Observable",
          variant: "o11y" as const,
        },
        {
          title: "Devtools",
          variant: "devtools" as const,
        },
      ].map(({ title, variant }) => (
        <Button
          key={title}
          onClick={() => store.setAppVariant(variant)}
          type={store.appVariant === variant ? "primary" : "default"}
        >
          {title}
        </Button>
      ))}
      <Typography>Content</Typography>
      {[
        {
          title: "Dqm",
          contentType: "r2" as RankiContentType,
        },
        {
          title: "Foreign",
          contentType: "foreign" as RankiContentType,
        },
      ].map(({ title, contentType }) => (
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
        value={store.cardType}
        onChange={(e) => store.setCardType(e.target.value)}
      />
      <Typography>Card</Typography>
      <Input
        value={store.card}
        onChange={(e) => store.setCard(e.target.value)}
      />
      <Typography>Deck</Typography>
      <Input
        value={store.deck}
        onChange={(e) => store.setDeck(e.target.value)}
      />
      <Typography>Tags</Typography>
      <Input
        value={store.tags}
        onChange={(e) => store.setTags(e.target.value)}
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
