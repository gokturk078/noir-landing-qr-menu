import type i18n from 'i18next';

function setMetaTagByName(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setMetaTagByProperty(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function applySeo({
  i18nInstance,
  route,
  t,
}: {
  i18nInstance: typeof i18n;
  route: '/' | '/menu';
  t: (key: string) => string;
}) {
  const language = (i18nInstance.resolvedLanguage || i18nInstance.language || 'tr').split('-')[0];

  document.documentElement.lang = language;

  const baseTitle = 'Noir & Blanc';
  const pageTitle = route === '/menu' ? `${t('menu')} | ${baseTitle}` : baseTitle;
  document.title = pageTitle;

  const description = t(route === '/menu' ? 'seo_menu_desc' : 'seo_home_desc');
  setMetaTagByName('description', description);
  setMetaTagByProperty('og:title', pageTitle);
  setMetaTagByProperty('og:description', description);
  setMetaTagByProperty('og:locale', language === 'tr' ? 'tr_TR' : language === 'de' ? 'de_DE' : language === 'ru' ? 'ru_RU' : 'en_US');
}

