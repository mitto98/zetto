import { Config } from './types/configType';
import Bt4 from './models/bootstrap4';

const defaultConfig: Config = {
  locale: 'it',
  model: 'bootstrap4',
  models: {
    default: Bt4,
  },
};

export default defaultConfig;
