-- A ordem da Word list passou a abrir com as palavras comuns (camadas de sort_key).
-- Esvazia a lista uma vez para o seed rodar de novo com a ordem nova; numa instalação nova não faz nada.
DELETE FROM `words`;
