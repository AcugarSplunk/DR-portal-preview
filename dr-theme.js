(() => {
  const backgrounds = [
    'Assets/PortalBG-alt1.png',
    'Assets/PortalBG-alt2.png',
    'Assets/PortalBG-alt3.png',
    'Assets/PortalBG-alt4.png',
    'Assets/PortalBG-alt5.jpg'
  ];
  const storageKey = 'dr-portal-background-index';
  const brandStorageKey = 'dr-portal-brand';
  const root = document.documentElement;

  const normalizeIndex = (value) => {
    const index = Number.parseInt(value ?? '0', 10);
    return Number.isInteger(index) && index >= 0 && index < backgrounds.length ? index : 0;
  };

  const getSavedIndex = () => {
    try { return normalizeIndex(localStorage.getItem(storageKey)); }
    catch { return 0; }
  };

  const applyTheme = (index) => {
    const normalized = normalizeIndex(index);
    root.style.setProperty('--dr-page-bg', `url('${backgrounds[normalized]}')`);
    try { localStorage.setItem(storageKey, String(normalized)); }
    catch { /* The selected theme still applies for this page. */ }
    return normalized;
  };

  const cycleTheme = () => applyTheme((getSavedIndex() + 1) % backgrounds.length);

  const normalizeBrand = (value) => value === 'cisco' ? 'cisco' : 'splunk';
  const getSavedBrand = () => {
    try { return normalizeBrand(localStorage.getItem(brandStorageKey)); }
    catch { return 'splunk'; }
  };
  const applyBrand = (brand) => {
    const normalized = normalizeBrand(brand);
    root.dataset.brand = normalized;
    try { localStorage.setItem(brandStorageKey, normalized); }
    catch { /* The selected brand still applies for this page. */ }
    return normalized;
  };
  const toggleBrand = () => applyBrand(root.dataset.brand === 'cisco' ? 'splunk' : 'cisco');

  applyTheme(getSavedIndex());
  applyBrand(getSavedBrand());

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 't') {
      event.preventDefault();
      toggleBrand();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      cycleTheme();
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) applyTheme(event.newValue);
    if (event.key === brandStorageKey) applyBrand(event.newValue);
  });
  window.addEventListener('pageshow', () => {
    applyTheme(getSavedIndex());
    applyBrand(getSavedBrand());
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      applyTheme(getSavedIndex());
      applyBrand(getSavedBrand());
    }
  });

  window.drPortalTheme = Object.freeze({
    cycleBackground: cycleTheme,
    getBackgroundIndex: getSavedIndex,
    setBrand: applyBrand,
    toggleBrand,
    getBrand: getSavedBrand
  });
})();
