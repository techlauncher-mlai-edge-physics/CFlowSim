declare module "*.css";
declare module "*.glsl";
declare module "*.md";

declare module "*.md" {
  const html: string;
  export default html;
}
