import { Dqm } from "@ranki/package-dqm-v2";

export function main() {
  const dqm = new Dqm({}, []);
  try {
    const res = dqm.parse("hi");
    console.log({ res });
  } catch (e) {
    console.log((e as any)[Symbol.toPrimitive]("string"));
  }
}

// main();
