import { Dqm } from "@ranki/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";

export function main() {
  const dqm = new Dqm({}, [baseV2]);
  try {
    const res = dqm.parse("hi");
    console.log({ res });
  } catch (e) {
    console.log(e);
    console.log((e as any).toString());
  }
}

main();
