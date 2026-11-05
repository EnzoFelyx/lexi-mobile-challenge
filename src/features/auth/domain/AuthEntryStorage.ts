/** Guarda se a pessoa já escolheu entrar como visitante, para não ver o login a cada abertura. */
export interface AuthEntryStorage {
  /** Leitura síncrona: decide a primeira tela antes de ela aparecer. */
  hasChosenGuest(): boolean;
  saveGuestChoice(): Promise<void>;
}
