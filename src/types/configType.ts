import Model from './ModelType';

export interface Config {
  locale: string;
  model: string;
  models: { default: Model } & Record<string, Model>;
}
