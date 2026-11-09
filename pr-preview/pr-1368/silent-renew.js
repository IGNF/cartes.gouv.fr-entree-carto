window.parent.postMessage(
  {
    source: 'oidc-client',
    url: window.location.href,
    keepOpen: false,
  },
  window.location.origin,
)