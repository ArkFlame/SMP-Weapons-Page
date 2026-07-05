const DOC_INDEX = [
  { id: 'overview', title: 'Overview', sub: 'What SMPWeapons does', icon: 'bi-info-circle', href: '#overview' },
  { id: 'quickstart', title: 'Quick start', sub: 'Installation steps', icon: 'bi-rocket-takeoff', href: '#quickstart' },
  { id: 'requirements', title: 'Requirements', sub: 'Compatibility', icon: 'bi-server', href: '#requirements' },
  { id: 'commands', title: 'Commands', sub: 'Admin and player commands', icon: 'bi-terminal', href: '#commands' },
  { id: 'permissions', title: 'Permissions', sub: 'Permission reference', icon: 'bi-shield-lock', href: '#permissions' },
  { id: 'configuration', title: 'Configuration', sub: 'Config file map', icon: 'bi-sliders', href: '#configuration' },
  { id: 'weapon-format', title: 'Weapon YAML', sub: 'Weapon definition format', icon: 'bi-file-earmark-code', href: '#weapon-format' },
  { id: 'triggers', title: 'Triggers', sub: 'Triggers, conditions, cooldowns', icon: 'bi-stopwatch', href: '#triggers' },
  { id: 'timeline', title: 'Timeline DSL', sub: 'Ability scripting', icon: 'bi-code-slash', href: '#timeline' },
  { id: 'command-weapons', title: 'Command weapons', sub: 'Command-run items', icon: 'bi-terminal', href: '#command-weapons' },
  { id: 'built-ins', title: 'Built-in weapons', sub: 'Bundled weapon pack', icon: 'bi-grid-3x3-gap', href: '#built-ins' },
  { id: 'menus', title: 'Menus', sub: 'Weapon menus', icon: 'bi-list-ul', href: '#menus' },
  { id: 'identity', title: 'Item identity', sub: 'Legacy matching', icon: 'bi-fingerprint', href: '#identity' },
  { id: 'hooks', title: 'Hooks', sub: 'SMPRegions hook', icon: 'bi-plug', href: '#hooks' },
  { id: 'troubleshooting', title: 'Troubleshooting', sub: 'Common issues', icon: 'bi-life-preserver', href: '#troubleshooting' },
  { id: 'publishing', title: 'Publishing', sub: 'GitHub Pages', icon: 'bi-github', href: '#publishing' }
];

function app() {
  return {
    weapons: [],
    sources: [],
    query: '',
    filterState: 'all',
    filterSource: 'all',
    globalQuery: '',
    globalResults: [],
    searchFocused: false,
    navOpen: false,
    activeSection: 'overview',

    async init() {
      try {
        const res = await fetch('data/weapons.json');
        this.weapons = await res.json();
        this.sources = [...new Set(this.weapons.map(w => w.source))].sort();
      } catch (e) {
        console.error('Failed to load weapons.json', e);
        this.weapons = [];
      }
      this.observeSections();
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          document.querySelector('.topbar-search input')?.focus();
        }
        if (e.key === 'Escape') this.searchFocused = false;
      });
    },

    get enabledCount() {
      return this.weapons.filter(w => w.enabled).length;
    },
    get sourceCount() {
      return this.sources.length;
    },
    get filteredWeapons() {
      const q = this.query.trim().toLowerCase();
      return this.weapons.filter(w => {
        if (this.filterState === 'enabled' && !w.enabled) return false;
        if (this.filterState === 'example' && w.enabled) return false;
        if (this.filterSource !== 'all' && w.source !== this.filterSource) return false;
        if (!q) return true;
        const hay = [
          w.id, w.display, w.ability, w.trigger,
          ...(w.materials || []), ...(w.lore || []), ...(w.commands || [])
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });
    },

    runGlobalSearch() {
      const q = this.globalQuery.trim().toLowerCase();
      if (q.length < 2) { this.globalResults = []; return; }
      const docHits = DOC_INDEX.filter(d =>
        d.title.toLowerCase().includes(q) || d.sub.toLowerCase().includes(q)
      );
      const weaponHits = this.weapons
        .filter(w => (w.display + ' ' + w.id + ' ' + w.ability).toLowerCase().includes(q))
        .slice(0, 6)
        .map(w => ({ id: 'w-' + w.id, title: w.display, sub: w.ability, icon: 'bi-swords', href: '#built-ins' }));
      this.globalResults = [...docHits, ...weaponHits].slice(0, 10);
    },

    goTo(href) {
      this.globalQuery = '';
      this.globalResults = [];
      this.searchFocused = false;
      window.location.hash = href;
    },

    copyCode(evt) {
      const btn = evt.currentTarget;
      const code = btn.closest('.code-block').querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="bi bi-check2"></i>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<i class="bi bi-clipboard"></i>';
        }, 1500);
      });
    },

    observeSections() {
      const sections = document.querySelectorAll('.section, .hero');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) this.activeSection = id;
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      sections.forEach(s => observer.observe(s));
    }
  };
}
