import { VueConstructor } from 'vue';

export default interface Model {
  table: VueConstructor;
  pagination: VueConstructor;
  detail: VueConstructor;
  button: VueConstructor;

  formFields: {
    string: VueConstructor;
    [key: string]: VueConstructor;
  };
}
