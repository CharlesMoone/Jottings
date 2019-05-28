const COOKIE_KEY = 'CSRF-TOKEN';
const HEADER_KEY = 'X-CSRF-TOKEN';

const reg = new RegExp(`(?:^|;\s)${COOKIE_KEY}=([^;]+)(?:;|$)`);

try {
  const pluginFetch = require('@becu/plugin-fetch');
  pluginFetch.appendGlobalPlugin({
    main(url, request) {
      const TOKEN = document.cookie.match(reg);
      if (TOKEN) {
        if (!request.headers) {
          request.headers = {};
        }
        request.headers[HEADER_KEY] = TOKEN[1];
      }
    },
  });
} catch {}
