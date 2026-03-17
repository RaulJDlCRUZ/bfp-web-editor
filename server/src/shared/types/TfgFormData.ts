/* Tipo de dato compartido del formulario de usuario del front-end */
export type TfgFormData = {
  title: string;
  subtitle: string;
  language: string;
  call: {
    year: string;
    month: string;
  };
  tutor: string;
  coTutor: string;
  department: string;
};
