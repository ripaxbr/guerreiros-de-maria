# AGGM – Associação Grupo Guerreiros de Maria

Site institucional da Associação Grupo Guerreiros de Maria — Av. Rio Jáguari, 1860, Bairro Mansour, Uberlândia - MG.

Site estático (um único `index.html` com Tailwind via CDN). Não precisa de build.

## Estrutura
- `index.html` — página completa
- `fotos/` — imagens da galeria:
  - `fachada-1860.webp`
  - `painel-sede.webp`
  - `mesa-brasil-sesc.webp`
  - `solenidade-camara.webp`
  - `homenagem-institucional.webp`
- `videos/` — `acao-guerreiros.mp4`

## Deploy na Vercel
Importe o repositório na Vercel com Framework Preset **Other**, sem comando de build e com Output Directory em branco (raiz).

## Painel da diretoria (Pages CMS)
Acesse https://app.pagescms.org, entre com o GitHub e abra este repositório.
- **Informações do site** edita WhatsApp, e-mail, projetos e a galeria (fotos e vídeos).
- O conteúdo fica em `content/site.json` e é aplicado no site por `js/conteudo.js`.
- A configuração do painel está em `.pages.yml`.
- Vídeos: prefira link do YouTube; arquivos enviados devem ser curtos (limite do GitHub: 100 MB).
