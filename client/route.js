export default function route(page) {
  switch (page) {
    case 'search-page':
      import('./pages/search-page')
      return page
  }
}
