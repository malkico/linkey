import i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: ['en', 'el'],
  defaultLocale: 'en',
  queryParameter: 'lang',
    autoReload: true,
    syncFiles: true,
  directory: path.join('./', 'locales'),
  api: {
    '__': 'translate',  
    '__n': 'translateN' 
  },
});

export default i18n;