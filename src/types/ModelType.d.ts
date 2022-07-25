import { ComponentPublicInstance } from 'vue';

export default interface Model {
  table: ComponentPublicInstance;
  pagination: ComponentPublicInstance;
  detail: ComponentPublicInstance;
  button: ComponentPublicInstance;

  formFields: {
    string: ComponentPublicInstance;
    [key: string]: ComponentPublicInstance;
  };
}
