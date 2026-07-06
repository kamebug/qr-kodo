# QR Kodo

> Ação digital instantânea

Gerador de QR codes personalizados — PWA em HTML/JS puro, sem build, sem backend, hospedado no GitHub Pages.

**Demo:** https://kamebug.github.io/qr-kodo/

## Recursos

- **Estilos de módulo:** quadrado, círculos, arredondado e classy, com controle independente dos cantos (moldura e miolo)
- **Cores:** sólida ou gradiente (linear/radial, rotação ajustável), fundo customizável ou transparente
- **Logo central:** upload local com tamanho ajustável; a correção de erro sobe automaticamente para o nível H (30%) quando há logo
- **Exportação:** PNG (256–2048 px) e SVG vetorial
- **Compartilhamento:** Web Share API no celular (folha nativa), com fallback para área de transferência ou download no desktop
- **Offline:** funciona sem internet após a primeira visita (service worker com cache-first)

## Privacidade

Todo o processamento acontece no navegador. O texto digitado, as cores escolhidas e a imagem do logo **nunca saem do seu dispositivo** — não há servidor, banco de dados, cookies ou rastreamento. O upload do logo usa a FileReader API local; a imagem não é enviada a lugar nenhum.

## Stack

| Componente | Tecnologia |
|---|---|
| Interface | HTML/CSS/JS puro (arquivo único) |
| Geração de QR | [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) via CDN |
| Offline/instalável | Service worker + Web App Manifest |
| Hospedagem | GitHub Pages |

## Estrutura

```
qr-kodo/
├── index.html      # app completo (UI + lógica)
├── manifest.json   # metadados do PWA
├── sw.js           # service worker (cache offline)
└── icons/          # ícones 192/512 + maskable
```

## Desenvolvimento

Não há etapa de build. Para rodar localmente:

```bash
python -m http.server 8000
# http://localhost:8000
```

O service worker exige HTTPS ou `localhost` — abrir o arquivo direto via `file://` funciona para a UI, mas sem o modo offline.

**Ao publicar alterações**, incremente `CACHE_VERSION` em `sw.js` (ex.: `qrkodo-v1` → `qrkodo-v2`), senão os usuários continuam recebendo a versão antiga do cache.

## Avisos

- **Teste antes de usar.** Combinações de cores com baixo contraste, gradientes muito claros ou logos grandes podem tornar o código ilegível para alguns leitores. Sempre escaneie o resultado com a câmera do celular antes de imprimir ou publicar.
- **Conteúdo é responsabilidade de quem gera.** O QR Kodo apenas codifica o texto fornecido; o uso do QR code resultante e o destino para o qual ele aponta são de responsabilidade do usuário.
- **Sem garantias.** O software é fornecido "como está", sem garantia de qualquer tipo, nos termos da licença MIT.

## Licença

[MIT](LICENSE) © kamebug
