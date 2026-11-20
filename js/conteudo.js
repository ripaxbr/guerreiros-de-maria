// Carrega content/site.json (editado pelo painel Pages CMS) e atualiza o site.
// Se o arquivo não carregar, o site continua mostrando o conteúdo fixo do index.html.
(function () {
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const CATEGORIAS = {
    social: { nome: 'Assistência Social', badge: 'text-gold-600 bg-amber-50' },
    educacao: { nome: 'Educação & Cultura', badge: 'text-navy-900 bg-slate-100' },
    comunidade: { nome: 'Ações Comunitárias', badge: 'text-emerald-700 bg-emerald-50' }
  };

  function youtubeId(url) {
    const m = String(url || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  function aplicarContato(c) {
    if (!c) return;
    const num = String(c.whatsapp || '').replace(/\D/g, '');
    if (num) {
      window.WHATSAPP_NUM = num;
      document.querySelectorAll('a[href*="wa.me/"]').forEach((a) => {
        a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + num);
      });
    }
    if (c.whatsapp_exibicao) {
      document.querySelectorAll('[data-campo="whatsapp"]').forEach((el) => (el.textContent = c.whatsapp_exibicao));
    }
    const email = String(c.email || '').trim();
    document.querySelectorAll('[data-email-bloco]').forEach((el) => el.classList.toggle('hidden', !email));
    document.querySelectorAll('[data-campo-email]').forEach((a) => { a.textContent = email; a.href = 'mailto:' + email; });
    document.querySelectorAll('[data-campo-email-texto]').forEach((el) => (el.textContent = email));
  }

  function aplicarProjetos(lista) {
    const grid = document.getElementById('projects-grid');
    if (!grid || !Array.isArray(lista)) return;
    grid.innerHTML = lista.map((p, i) => {
      const cat = CATEGORIAS[p.categoria] || CATEGORIAS.comunidade;
      return `<article data-category="${esc(p.categoria)}" class="project-card bg-white rounded-2xl p-6 border border-sand-200 shadow-sm flex flex-col justify-between">
          <div>
            <span class="inline-block text-xs font-bold uppercase tracking-wider ${cat.badge} px-3 py-1 rounded-full mb-3">${esc(cat.nome)}</span>
            <h3 class="font-serif font-bold text-xl text-navy-900 mb-2">${esc(p.titulo)}</h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-4">${esc(p.resumo)}</p>
          </div>
          ${p.detalhes ? `<button data-projeto="${i}" class="text-navy-900 font-bold text-sm hover:text-gold-600 inline-flex items-center gap-1">Ver detalhes →</button>` : ''}
        </article>`;
    }).join('');
    grid.querySelectorAll('[data-projeto]').forEach((b) => {
      const p = lista[+b.dataset.projeto];
      b.addEventListener('click', () => openModal(p.titulo, p.detalhes));
    });
  }

  function midia(item) {
    const yt = youtubeId(item.youtube);
    if (item.tipo === 'video' && yt) {
      return `<iframe src="https://www.youtube.com/embed/${yt}" title="${esc(item.titulo)}" class="w-full h-full border-0" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    if (item.tipo === 'video') {
      return `<video controls preload="metadata" class="w-full h-full object-cover"><source src="${esc(item.video)}" type="video/mp4" /></video>
            <div class="hidden w-full h-full flex-col items-center justify-center p-4 text-center text-xs text-slate-300 gap-2">
              <span>Vídeo ainda não enviado.</span>
              <span class="text-[11px] text-slate-400">Envie o arquivo ou cole um link do YouTube no painel.</span>
            </div>`;
    }
    return `<img src="${esc(item.imagem)}" alt="${esc(item.titulo)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
            <div class="hidden w-full h-full items-center justify-center p-4 text-center text-xs text-slate-300">Foto não encontrada</div>`;
  }

  function aplicarGaleria(lista) {
    const grid = document.getElementById('media-grid');
    if (!grid || !Array.isArray(lista)) return;
    grid.innerHTML = lista.map((item) => {
      const video = item.tipo === 'video';
      return `<figure data-type="${video ? 'video' : 'foto'}" class="media-item group bg-sand-50 rounded-2xl overflow-hidden border border-sand-200 shadow-sm">
          <div class="relative aspect-[4/3] ${video ? 'bg-navy-950' : 'bg-navy-900'} overflow-hidden">${midia(item)}</div>
          <figcaption class="p-4">
            <span class="text-[11px] font-bold uppercase tracking-wider ${video ? 'text-emerald-700' : 'text-gold-600'}">${video ? 'Vídeo' : 'Foto'}${item.etiqueta ? ' • ' + esc(item.etiqueta) : ''}</span>
            <h3 class="font-serif font-bold text-navy-900 text-base mt-0.5">${esc(item.titulo)}</h3>
            ${item.legenda ? `<p class="text-xs text-slate-600 mt-1">${esc(item.legenda)}</p>` : ''}
          </figcaption>
        </figure>`;
    }).join('');
    // Mostra o aviso quando a foto ou o vídeo não existe
    grid.querySelectorAll('img').forEach((img) => img.addEventListener('error', () => {
      img.style.display = 'none'; img.nextElementSibling.style.display = 'flex';
    }));
    grid.querySelectorAll('video source').forEach((src) => src.addEventListener('error', () => {
      const v = src.parentElement; v.style.display = 'none'; v.nextElementSibling.style.display = 'flex';
    }));
  }

  fetch('content/site.json', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d) => { aplicarContato(d.contato); aplicarProjetos(d.projetos); aplicarGaleria(d.galeria); })
    .catch((e) => console.warn('Conteúdo do painel não carregado; usando o padrão.', e));
})();
