// Root "/" → /en/ or /pt/ (stored preference first, then browser language; default English)
(function () {
  var l = null;
  try { l = localStorage.getItem('rb-lang'); } catch (e) {}
  if (l !== 'en' && l !== 'pt') {
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    l = /^pt\b/i.test(nav) ? 'pt' : 'en';
  }
  location.replace('/' + l + '/' + location.hash);
})();
