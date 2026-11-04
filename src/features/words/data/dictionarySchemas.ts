import { z } from 'zod';

/** Resposta da Free Dictionary API: só os campos usados (o Zod descarta o resto). */
export const dictionaryResponseSchema = z
  .array(
    z.object({
      word: z.string(),
      phonetic: z.string().optional(),
      phonetics: z
        .array(z.object({ text: z.string().optional(), audio: z.string().optional() }))
        .default([]),
      meanings: z.array(
        z.object({
          partOfSpeech: z.string(),
          definitions: z.array(
            z.object({ definition: z.string(), example: z.string().optional() }),
          ),
        }),
      ),
    }),
  )
  .min(1);

/** Detalhe guardado no `word_cache.payload`: validado de novo ao ler. */
export const wordDetailSchema = z.object({
  word: z.string(),
  phonetic: z.string().nullable(),
  audioUrls: z.array(z.string()),
  meanings: z.array(
    z.object({
      partOfSpeech: z.string(),
      definitions: z.array(z.object({ definition: z.string(), example: z.string().nullable() })),
    }),
  ),
});
