import type { MouseEvent } from 'react';

export interface ArchiveItem {
  content: string;
  date?: string | null;
  listable: boolean;
  page: number;
  parentPath: string;
  path: string;
  title: string;
  totalPages: number;
  url: string;
}

export function listableItems<T extends { listable?: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.listable !== false);
}

export function pagePath(parentPath: string, page: number): string {
  const base = parentPath.endsWith('/') ? parentPath : `${parentPath}/`;
  return page <= 1 ? base : `${base}${page}/`;
}

export function routePath(pathname: string): string {
  let path = pathname;
  if (path.startsWith('/history/')) {
    path = path.slice('/history'.length);
  }
  if (path.endsWith('/1/')) {
    path = path.slice(0, -2);
  }
  return path.endsWith('/') ? path : `${path}/`;
}

export function findItem<T extends { path: string }>(
  items: T[],
  pathname: string,
): T | undefined {
  const path = routePath(pathname);
  return items.find((item) => item.path === path);
}

export function handleContentClick(event: MouseEvent<HTMLDivElement>) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const anchor = target.closest('a');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || !href.startsWith('#') || href.startsWith('#/')) return;

  event.preventDefault();
  const id = href.slice(1);
  if (!id) return;

  let decoded = id;
  try {
    decoded = decodeURIComponent(id);
  } catch {
    decoded = id;
  }

  const element = document.getElementById(id) ?? document.getElementById(decoded);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
