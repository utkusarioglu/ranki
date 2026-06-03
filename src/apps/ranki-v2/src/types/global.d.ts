declare module "*.css?inline" {
  const style: string;
  export default style;
}

declare module "*.html?raw" {
  const html: string;
  export default html;
}
