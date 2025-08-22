const BIG = `
%%%
cat

# bunny _cat_ dog

meow meow meow meow meow
more   meow

:::pre; asdfs :::

:::pre
dog
sdf
/rrrr/
:::
  `;

const SMALL = `
meow meow meow meow meow
more   meow three
`;

export function populate() {
  const a = document.querySelector<HTMLScriptElement>("script.ranki-field.a");
  if (a) {
    a.innerHTML = BIG;
  }
  const b = document.querySelector<HTMLScriptElement>("script.ranki-field.b");
  if (b) {
    b.innerHTML = `normal text`;
  }
}
