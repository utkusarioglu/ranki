import type {
  AnkiDistStore,
  ColorSchemes,
  RankiFace,
  RankiFlag,
} from "_stores/anki-dist/anki.store.types.mjs";
import { Button, Input, Typography } from "antd";
import { useState, type FC } from "react";
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
  // name?: string;
}

const FLAGS: Flag[] = [
  {
    color: "none",
    flag: "flag0",
    // name: "None",
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

const emit = (event: string, value: string) =>
  window.dispatchEvent(
    new CustomEvent("ranki-command", { detail: { [event]: value } }),
  );

const INITIAL = {
  face: FACES[0],
  flag: FLAGS[0].flag,
  type: "+r:AB:BA",
  card: "AB",
  deck: "Cat::Dog::Bunny::Bird::Tiger::Goat",
  tags: "caution",
};

export const AnkiRenderSettings: FC<AnkiRenderSettingsProps> = ({
  aspectRatios,
  scales,
  colorSchemes,
  store,
}) => {
  const [fields, setField] = useState(INITIAL);

  const doChange = (name: keyof typeof INITIAL, value: string) => {
    setField((s) => ({ ...s, [name]: value }));
    emit(name, value);
  };

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
      <Typography>Face</Typography>
      {FACES.map((face) => (
        <Button
          key={face}
          onClick={() => doChange("face", face)}
          type={face === fields.face ? "primary" : "default"}
        >
          {face}
        </Button>
      ))}
      <Typography>Flag</Typography>
      {FLAGS.map((flag) => (
        <Button
          // onClick={() => store.setFlag(flag.flag)}
          onClick={() => doChange("flag", flag.flag)}
          style={{
            backgroundColor: flag.color,
            color: flag.flag === fields.flag ? "#FFF" : "transparent",
          }}
        >
          <CheckOutlined />
        </Button>
      ))}
      <Typography>Type</Typography>
      <Input
        value={fields.type}
        // onChange={(e) => store.setCardType(e.target.value)}
        onChange={(e) => doChange("type", e.target.value)}
      />
      <Typography>Card</Typography>
      <Input
        value={fields.card}
        // onChange={(e) => store.setCard(e.target.value)}
        onChange={(e) => doChange("card", e.target.value)}
      />
      <Typography>Deck</Typography>
      <Input
        value={fields.deck}
        // onChange={(e) => store.setDeck(e.target.value)}
        onChange={(e) => doChange("deck", e.target.value)}
      />
      <Typography>Tags</Typography>
      <Input
        value={fields.tags}
        onChange={(e) => doChange("tags", e.target.value)}
        // onChange={(e) => store.setTags(e.target.value)}
      />
      {/* <Typography>Template Config</Typography>
      <Input.TextArea
        className={style.textarea}
        autoSize
        onChange={(e) => store.setTemplateConfig(e.target.value)}
        value={store.templateConfig}
      /> */}
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
