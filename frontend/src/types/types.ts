export type ElementType = "text" | "image" | "video" | "code" | "";

export type SlideElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  fontSize?: number;
  color?: string;
  layer: number;
  url?: string;
  altText?: string;
};

export type Slide = {
  id: string;
  position: number;
  elements: SlideElement[];
};

export type Slides = {
  [key: string]: Slide;
};