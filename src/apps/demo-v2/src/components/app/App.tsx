import type { FC } from "react";
import { useEffect, useState } from "react";
import appStyle from "./app.module.css";
import { Inputs } from "../inputs/Inputs";

import { Output } from "../output/Output";

interface RankiV2DemoProps {
  defaultConfigStr: string;
}

const RankiV2Demo: FC<RankiV2DemoProps> = ({ defaultConfigStr }) => {
  // const [rankiConfigStr, setRankiConfigStr] = useState(defaultConfigStr);
  // const [availablePlugins, setAvailablePlugins] = useState(allPlugins);
  // const [selectedPlugins, setSelectedPlugins] = useState<string[]>([]);
  // const [rankiStr, setRankiStr] = useState("");
  const [parsed, setRankiParsed] = useState<object | null>(null);
  // const [rankiRender, setRankiRender] = useState("");

  return (
    <div className={[appStyle.layout].join(" ")}>
      <Inputs
        setRankiParsed={setRankiParsed}
        defaultConfigStr={defaultConfigStr}
      />
      <Output parsed={parsed} />
    </div>
  );
};

function App() {
  const [config, setConfig] = useState<string | null>(null);

  useEffect(() => {
    fetch("/config.yaml")
      .then((r) => r.text())
      .then((t) => setConfig(t));
  }, []);

  if (config === null) {
    return <div>loading</div>;
  }

  return <RankiV2Demo defaultConfigStr={config} />;
}

export default App;
