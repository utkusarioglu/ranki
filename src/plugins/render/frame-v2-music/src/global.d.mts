declare module "*.css?raw" {
  const css: string;
  export default css;
}

declare module "*.html?raw" {
  const html: string;
  export default html;
}

declare module "*.txt?raw" {
  const fontText: string;
  export default fontText;
}
