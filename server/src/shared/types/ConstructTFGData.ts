/* Tipo de dato pensado para organizar los recursos básicos para "construir" un TFG */
export type constructTFGData = {
  chapters: Record<number, { title: string; content: string }>;
  appendices: Record<number, { title: string; content: string }>;
  setupFiles: Record<string, any>;
  resources: Record<string, any>;
  config: Record<string, any>;
  bibliography: string;
};
