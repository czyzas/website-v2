export const getHomepageLink = (slug = '', lang = 'pl') => {
  let link = lang !== 'pl' ? `/${lang}/` : '/';

  if (slug) {
    link += slug.startsWith('/') ? `${slug.substring(1)}` : slug;
  }

  return link;
};
