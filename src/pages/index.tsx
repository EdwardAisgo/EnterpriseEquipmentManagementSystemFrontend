import { history, useModel } from '@umijs/max';
import { useEffect } from 'react';

const findFirstMenuPath = (menus: any[]): string | undefined => {
  for (const menu of menus || []) {
    if (menu.hideInMenu) continue;
    if (menu.path) return menu.path;
    if (menu.children) {
      const childPath = findFirstMenuPath(menu.children);
      if (childPath) return childPath;
    }
  }
  return undefined;
};

export default function IndexPage() {
  const { initialState, loading } = useModel('@@initialState');

  useEffect(() => {
    if (!loading) {
      const firstPath = findFirstMenuPath(initialState?.menuData || []);
      if (firstPath) {
        history.replace(firstPath);
      } else {
        history.replace('/403');
      }
    }
  }, [loading, initialState]);

  return null;
}
