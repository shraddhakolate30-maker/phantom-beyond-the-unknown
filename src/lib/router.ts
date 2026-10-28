import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'wall'; category?: string }
  | { name: 'discover' }
  | { name: 'share' }
  | { name: 'forge' }
  | { name: 'week' }
  | { name: 'atmosphere' }
  | { name: 'story'; id: string };

function parse(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const [path, query] = clean.split('?');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  switch (parts[0]) {
    case 'wall': {
      const params = new URLSearchParams(query ?? '');
      const cat = params.get('category') ?? undefined;
      return { name: 'wall', category: cat };
    }
    case 'story':
      return { name: 'story', id: parts[1] ?? '' };
    case 'discover':
      return { name: 'discover' };
    case 'share':
      return { name: 'share' };
    case 'forge':
      return { name: 'forge' };
    case 'week':
      return { name: 'week' };
    case 'atmosphere':
      return { name: 'atmosphere' };
    default:
      return { name: 'home' };
  }
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));

  useEffect(() => {
    const onHash = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}

export function navigate(route: Route) {
  let hash = '#/';
  switch (route.name) {
    case 'home':
      hash = '#/';
      break;
    case 'wall':
      hash = route.category ? `#/wall?category=${route.category}` : '#/wall';
      break;
    case 'story':
      hash = `#/story/${route.id}`;
      break;
    case 'discover':
      hash = '#/discover';
      break;
    case 'share':
      hash = '#/share';
      break;
    case 'forge':
      hash = '#/forge';
      break;
    case 'week':
      hash = '#/week';
      break;
    case 'atmosphere':
      hash = '#/atmosphere';
      break;
  }
  if (window.location.hash === hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.location.hash = hash;
  }
}
