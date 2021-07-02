import { EntityProperty } from '@manydesigns/portofino';

type DisplayFunction = () => boolean;

export interface Attribute extends EntityProperty {
  display?: boolean | DisplayFunction;
}

export interface AttributesConfig {
  [key: string]: Attribute;
}
