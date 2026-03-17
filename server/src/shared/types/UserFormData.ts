/* Tipo de dato compartido del formulario de usuario del front-end */
export type UserFormData = {
  name: string;
  lastNames: string[];
  email: string;
  password: string;
  technology: string;
  phone?: number;
};
