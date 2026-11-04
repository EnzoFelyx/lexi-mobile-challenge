import { Directory, File, Paths } from 'expo-file-system';
import { injectable } from 'tsyringe';

import { PRONUNCIATION_CACHE_DIR } from '@/constants/audio';

import type { PronunciationAudioCache } from '../domain/PronunciationAudio';

/** Nome do arquivo local a partir da URL da API (ex.: `hello-uk.mp3`), só com caracteres seguros. */
export function cacheFileNameFor(url: string): string {
  const lastSegment = url.split('?')[0]?.split('/').pop() ?? '';
  return lastSegment.replace(/[^a-zA-Z0-9._-]/g, '_') || 'pronunciation.mp3';
}

/**
 * Cache dos mp3 no aparelho (pasta de cache do sistema, que pode ser limpa se faltar espaço).
 * O `downloadFileAsync` rejeita respostas fora de 2xx, então um 502 vira erro na hora. Um áudio
 * que falhou não é tentado de novo nesta sessão (reabrir a palavra vai direto para a voz); na
 * próxima vez que o app abrir, tenta outra vez, caso o servidor tenha voltado.
 */
@injectable()
export class FileSystemPronunciationAudioCache implements PronunciationAudioCache {
  private readonly failedUrls = new Set<string>();

  async resolve(url: string): Promise<string> {
    if (this.failedUrls.has(url)) {
      throw new Error(`The pronunciation audio already failed in this session: ${url}`);
    }
    const directory = new Directory(Paths.cache, PRONUNCIATION_CACHE_DIR);
    const file = new File(directory, cacheFileNameFor(url));
    if (file.exists) {
      return file.uri;
    }
    directory.create({ intermediates: true, idempotent: true });
    try {
      const downloaded = await File.downloadFileAsync(url, file, { idempotent: true });
      return downloaded.uri;
    } catch (error) {
      this.failedUrls.add(url);
      throw error;
    }
  }
}
