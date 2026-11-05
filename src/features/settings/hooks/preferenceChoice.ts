/** Uma opção de preferência, com o texto no idioma atual. */
export interface PreferenceOption<T extends string> {
  value: T;
  label: string;
}

/** O que a tela precisa para mostrar e trocar uma preferência (tema ou idioma). */
export interface PreferenceChoice<T extends string> {
  selected: T;
  options: readonly PreferenceOption<T>[];
  choose: (value: T) => void;
}

/** Texto da opção escolhida, para mostrar na linha. */
export const selectedLabel = <T extends string>(choice: PreferenceChoice<T>): string =>
  choice.options.find((option) => option.value === choice.selected)?.label ?? '';
