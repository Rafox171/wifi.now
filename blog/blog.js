/* ============================================================
   Blog wi-fi.now: comportamentos das páginas do blog
   Numerais das seções, "Wi-Fi" sem quebra, índice, copiar link
   e filtro por categoria. Cada bloco só age se o elemento existir.
   ============================================================ */
(function () {
    // Numerais das seções: os mesmos ícones da página de Privacidade
    // (Material Symbols filter_1 a filter_13): moldura comum + algarismo
    var NUM_FRAME = 'M320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z';
    var NUM_DIGITS = {
        1: 'M560-360h80v-400H480v80h80v320Z',
        2: 'M440-360h240v-80H520v-80h80q33 0 56.5-23.5T680-600v-80q0-33-23.5-56.5T600-760H440v80h160v80h-80q-33 0-56.5 23.5T440-520v160Z',
        3: 'M440-360h160q33 0 56.5-23.5T680-440v-60q0-26-17-43t-43-17q26 0 43-17t17-43v-60q0-33-23.5-56.5T600-760H440v80h160v80h-80v80h80v80H440v80Z',
        4: 'M600-360h80v-400h-80v160h-80v-160h-80v240h160v160Z',
        5: 'M440-360h160q33 0 56.5-23.5T680-440v-80q0-33-23.5-56.5T600-600h-80v-80h160v-80H440v240h160v80H440v80Z',
        6: 'M520-360h80q33 0 56.5-23.5T680-440v-80q0-33-23.5-56.5T600-600h-80v-80h120v-80H520q-33 0-56.5 23.5T440-680v240q0 33 23.5 56.5T520-360Zm0-160h80v80h-80v-80Z',
        7: 'M440-360h80l160-320v-80H440v80h160L440-360Z',
        8: 'M520-360h80q33 0 56.5-23.5T680-440v-60q0-26-17-43t-43-17q26 0 43-17t17-43v-60q0-33-23.5-56.5T600-760h-80q-33 0-56.5 23.5T440-680v60q0 26 17 43t43 17q-26 0-43 17t-17 43v60q0 33 23.5 56.5T520-360Zm0-320h80v80h-80v-80Zm0 240v-80h80v80h-80Z',
        9: 'M480-360h120q33 0 56.5-23.5T680-440v-240q0-33-23.5-56.5T600-760h-80q-33 0-56.5 23.5T440-680v80q0 33 23.5 56.5T520-520h80v80H480v80Zm120-240h-80v-80h80v80Z',
        10: 'M370-360h80v-400h-80v400ZM510-680v-80h240v80H510ZM510-360v-80h240v80H510ZM510-440h80v-240h-80v240ZM670-440h80v-240h-80v240Z',
        11: 'M370-360h80v-400h-80v400ZM590-360h80v-400h-80v400Z',
        12: 'M370-360h80v-400h-80v400ZM510-680v-80h240v80H510ZM670-600v-80h80v80h-80ZM510-520v-80h240v80H510ZM510-440v-80h80v80h-80ZM510-360v-80h240v80H510Z',
        13: 'M370-360h80v-400h-80v400ZM510-680v-80h240v80H510ZM670-440v-240h80v240h-80ZM550-520v-80h200v80H550ZM510-360v-80h240v80H510Z'
    };
    var SVG_NS = 'http://www.w3.org/2000/svg';

    function numeral(n) {
        if (!NUM_DIGITS[n]) return null;
        var svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'bl-num');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('viewBox', '0 -960 960 960');
        svg.setAttribute('width', '37');
        svg.setAttribute('height', '37');
        svg.setAttribute('fill', 'currentColor');
        var path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', NUM_DIGITS[n] + NUM_FRAME);
        svg.appendChild(path);
        return svg;
    }

    document.addEventListener('DOMContentLoaded', function () {
        // "Wi-Fi" não quebra no hífen dentro dos títulos
        document.querySelectorAll('.bl-page h1, .bl-page h2, .bl-page h3').forEach(function (h) {
            h.innerHTML = h.innerHTML.replace(/Wi-Fi/g, '<span class="bl-nowrap">Wi-Fi</span>');
        });

        // Cada h2 do texto ganha o numeral; o título vai para um span
        // para o flex não separar os pedaços do texto
        document.querySelectorAll('.bl-prose h2').forEach(function (h, i) {
            var icon = numeral(i + 1);
            if (!icon) return;
            var text = document.createElement('span');
            while (h.firstChild) text.appendChild(h.firstChild);
            h.appendChild(icon);
            h.appendChild(text);
        });

        // Índice: destaca a seção que está na tela
        var tocLinks = document.querySelectorAll('.bl-toc a');
        var sections = new Map();
        tocLinks.forEach(function (link) {
            var target = document.querySelector(link.getAttribute('href'));
            if (target) sections.set(target, link);
        });
        if ('IntersectionObserver' in window && sections.size) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    tocLinks.forEach(function (l) { l.classList.remove('is-active'); });
                    sections.get(entry.target).classList.add('is-active');
                });
            }, { rootMargin: '-90px 0px -70% 0px' });
            sections.forEach(function (_, section) { observer.observe(section); });
        }

        // Copiar link do artigo (usa a URL oficial do canonical)
        var copyBtn = document.querySelector('[data-copy-link]');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                var url = document.querySelector('link[rel="canonical"]').href;
                navigator.clipboard.writeText(url).then(function () {
                    copyBtn.textContent = 'Link copiado';
                    setTimeout(function () { copyBtn.textContent = 'Copiar link'; }, 2000);
                }).catch(function () {});
            });
        }

        // Filtro por categoria na página do blog (todos os cards já estão no HTML)
        var filters = document.querySelectorAll('.bl-filter');
        var items = document.querySelectorAll('.bl-item');
        var empty = document.querySelector('.bl-empty');
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var cat = btn.dataset.filter;
                var visible = 0;
                filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
                items.forEach(function (item) {
                    var show = cat === 'todos' || (item.dataset.cat || '').split(' ').indexOf(cat) !== -1;
                    item.hidden = !show;
                    if (show) visible++;
                });
                if (empty) empty.hidden = visible > 0;
            });
        });
    });
})();
