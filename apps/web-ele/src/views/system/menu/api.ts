import type { MenuInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取菜单列表
 */
export async function getMenuListApi(params?: {
  menuName?: string;
  status?: string;
}) {
  return requestClient.get('/system/menu/list', { ...params });
}

/**
 * 更新菜单信息
 */
export async function putMenuApi(params: MenuInfo) {
  return requestClient.put('/system/menu', params);
}

/**
 * 新增菜单
 */
export async function postMenuApi(params: MenuInfo) {
  return requestClient.post('/system/menu', params);
}

/**
 * 删除菜单
 */
export async function deleteMenuApi(menuId: number) {
  return requestClient.delete(`/system/menu/${menuId}`);
}
