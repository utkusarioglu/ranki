import { useUiStore } from "../../stores/ui/ui.store.mts";
import { AsyncIFrame } from "../iframe/IFrame";
import type { ResourceProps } from "../iframe/IFrame";
import style from "./DocumentRender.module.css";

const bod = document.createElement("div");
const h1 = document.createElement("h1");
bod.appendChild(h1);
h1.innerHTML = ["hi", "hello", "meo"].join("<br>");

const obj = [
  {
    element: bod,
    afterMount: [
      async () => {
        await new Promise((r) => setTimeout(r, 1e3));
        bod.style.height = "350px";
        bod.style.backgroundColor = "gray";
      },
    ],
  },
];

const options = {
  scheme: "dark",
};

export const DocumentRender = () => {
  const ui = useUiStore();

  // const [height, requestHeight] = useState<number>(ui.previewSize[1]);
  const promise = new Promise<ResourceProps[]>((r) =>
    setTimeout(() => r(obj), 0),
  );

  const requestHeight = (h: number) => {
    console.log("r", h);
  };

  return (
    <div className={style.container}>
      <div
        className={style.frame}
        style={{
          scale: ui.previewScale,
        }}
      >
        <AsyncIFrame
          resource={promise}
          options={options}
          width={ui.previewSize[0]}
          height={ui.previewSize[1]}
          requestHeight={requestHeight}
        />
      </div>
    </div>
  );
};
