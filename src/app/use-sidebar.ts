import { useState, useSyncExternalStore } from 'react';

const query = '(min-width: 1200px)';
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export function useSidebar() {
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true);
  const [override, setOverride] = useState<boolean | null>(null);
  const expanded = override ?? desktop;
  return { expanded, toggle: () => setOverride(!expanded) };
}
