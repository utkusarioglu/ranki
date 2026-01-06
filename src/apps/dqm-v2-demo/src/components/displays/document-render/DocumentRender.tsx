import { useUiStore } from "_stores/ui/ui.store.mts";
// @ts-expect-error
import { AsyncIFrame } from "_views/iframe/IFrame";
import type { ResourceProps } from "_views/iframe/IFrame";
import style from "./DocumentRender.module.css";
import { TrialRender } from "./Trial";

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
// @ts-expect-error
const options = {
  scheme: "dark",
};

export const DocumentRender = () => {
  const ui = useUiStore();

  // const [height, requestHeight] = useState<number>(ui.previewSize[1]);
  // @ts-expect-error
  const promise = new Promise<ResourceProps[]>((r) =>
    setTimeout(() => r(obj), 0),
  );

  // @ts-expect-error
  const requestHeight = (h: number) => {
    console.log("height request:", h);
  };

  return (
    <div className={style.container}>
      <div
        className={style.frame}
        style={{
          scale: ui.previewScale,
        }}
      >
        <TrialRender />
        {/* <AsyncIFrame
          resource={promise}
          options={options}
          width={ui.previewSize[0]}
          height={ui.previewSize[1]}
          requestHeight={requestHeight}
        /> */}
      </div>
    </div>
  );
};
