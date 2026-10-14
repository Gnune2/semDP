# Acervo de screenshots

Os **5 originais individuais**, somando **593,897 bytes**, foram copiados para a [pasta privada do projeto no Google Drive](https://drive.google.com/drive/folders/1BUdtbo1tr09I4W1YTYb1iwTxSO06SynP). Entrar na conta Google autorizada para abrir os links. Os IDs são estáveis; os arquivos não estão compactados.

Cada arquivo foi baixado novamente inteiro e comparado ao original por MD5, SHA-256 e tamanho em 14/10/2026 antes de retirar seu rastreamento do Git. Os registros estão em [manifesto.json](manifesto.json). A verificação é uma evidência datada, não um monitor contínuo.

| Caminho anterior | Bytes | Original no Drive |
| --- | ---: | --- |
| `screenshots/Screenshot_1.png` | 141226 | [Abrir arquivo](https://drive.google.com/file/d/1IFDmLD54te2TrZcD_SH_EBVGl17M1OFK/view) |
| `screenshots/Screenshot_2.png` | 133640 | [Abrir arquivo](https://drive.google.com/file/d/1-ixlUIRKgR7m0nZDBgpoOgspcGvKdHzc/view) |
| `screenshots/Screenshot_3.png` | 119348 | [Abrir arquivo](https://drive.google.com/file/d/1XGKRgQeJbCm4hWbdmjyvU1jY6NnrfEkv/view) |
| `screenshots/Screenshot_4.png` | 163781 | [Abrir arquivo](https://drive.google.com/file/d/1w7isT6cGRnupPx_r03OyW6l6FCd6nsFK/view) |
| `screenshots/Screenshot_5.png` | 35902 | [Abrir arquivo](https://drive.google.com/file/d/1O6GdzD9qb9yvDBsHSd5Ls17P5EA8TAOC/view) |

## Atualizar os códigos

Use `git pull --ff-only` para atualizar os códigos e o catálogo. **A primeira atualização que incorpora a migração remove os screenshots antes rastreados da árvore de trabalho**. Para manter imagens offline, salve uma cópia verificada fora do repositório antes desse pull. Não substitua alterações locais. Os originais já existentes nos checkouts usados para a migração foram preservados.

Para enviar código, confira `git status`, adicione somente as fontes desejadas, faça o commit e use `git push`. Os caminhos migrados estão no `.gitignore` para evitar subir novamente os binários. Novos arquivos de acervo vão para o Drive; registre depois ID, pasta, caminho, tamanho e hashes no catálogo/manifesto.

## Recuperar os originais em outro aparelho

Abra os links e baixe os arquivos individualmente. Guarde-os em uma pasta fora do Git reproduzindo os caminhos anteriores da tabela. Não precisa compartilhar a pasta publicamente. A ferramenta usa Python 3 sem dependências externas e não recebe senha nem instala login.

Exemplo: uma pasta `../acervo-baixado/semDP` deve conter `screenshots/Screenshot_1.png`. A partir da raiz do repositório:

```bash
python3 acervo/migracao.py cache-import --manifest acervo/manifesto.json --repo semDP \
  --source ../acervo-baixado/semDP --cache ../cache-acervo
```

O comando só confere os arquivos. Repita com `--apply` para criar o cache identificado por SHA-256. Em seguida:

```bash
python3 acervo/migracao.py restore --manifest acervo/manifesto.json --repo semDP \
  --cache ../cache-acervo --destination ../originais-semDP
```

Confira a contagem e repita com `--apply` para restaurar. Arquivos iguais já existentes são preservados; um arquivo diferente bloqueia antes das cópias. Para recuperar os caminhos dentro do clone, use `--destination .`: ficam ignorados pelo Git. No Windows, use `py -3` em vez de `python3` e caminhos válidos do Windows.

A retirada da branch não apaga versões antigas do histórico Git. Não houve reescrita de histórico. Ícones, imagens funcionais, fontes, instaladores e releases permanecem com o produto.
