export type Accent = 'uk' | 'us' | 'au' | 'ca';

/** O que o player toca: o mp3 da API ou, sem mp3, a voz do aparelho (CLAUDE.md 6.5). */
export type Pronunciation =
  { source: 'audio'; url: string; accent: Accent | null } | { source: 'voice' };

const ACCENT_PATTERN = /-(uk|us|au|ca)\.mp3$/i;

/** O sotaque vem do nome do arquivo da API (ex.: `hello-uk.mp3`). */
export function accentOf(url: string): Accent | null {
  const match = ACCENT_PATTERN.exec(url);
  return match ? (match[1]?.toLowerCase() as Accent) : null;
}

/** Toca o primeiro mp3 da API; sem nenhum, usa a voz do aparelho. */
export function pickPronunciation(audioUrls: readonly string[]): Pronunciation {
  const [url] = audioUrls;
  return url ? { source: 'audio', url, accent: accentOf(url) } : { source: 'voice' };
}
