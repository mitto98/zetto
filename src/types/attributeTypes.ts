type DisplayFunction = () => boolean;

export interface Attribute {
  name: string;
  display: boolean | DisplayFunction;
}

export interface AttributesConfig {
  [key: string]: Attribute;
}
