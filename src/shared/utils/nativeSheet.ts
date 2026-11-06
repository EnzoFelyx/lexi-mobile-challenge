const ANDROID_13_API = 33;

/** Android 13 ou mais novo. */
export function isAndroid13OrNewer(os: string, version: string | number): boolean {
  return os === 'android' && Number(version) >= ANDROID_13_API;
}

/**
 * Abaixo do Android 13, a folha nativa do detalhe não abriu num aparelho real (CLAUDE.md 6.2).
 * Se a folha nativa funciona neste sistema; onde não funciona, o detalhe abre em tela cheia.
 */
export function supportsNativeSheet(os: string, version: string | number): boolean {
  return os !== 'android' || isAndroid13OrNewer(os, version);
}
