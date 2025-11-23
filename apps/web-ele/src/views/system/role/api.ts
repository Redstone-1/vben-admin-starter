import type { RoleInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取角色列表
 */
export async function getRoleListApi(params: {
  pageNum: number;
  pageSize: number;
  roleName?: string;
  status?: string;
}) {
  return requestClient.get('/system/role/list', { ...params });
}

/**
 * 获取角色相关菜单
 */
export async function getRoleMenuTreeSelectApi(roleId?: number) {
  const url = roleId
    ? `/system/menu/roleMenuTreeselect/${roleId}`
    : '/system/menu/treeselect';
  return requestClient.get(url);
}

/**
 * 改变角色状态
 */
export async function changeStatusApi(params: {
  roleId: number;
  status: string;
}) {
  return requestClient.put('/system/role/changeStatus', params);
}

/**
 * 更新角色信息
 */
export async function putRoleApi(params: RoleInfo) {
  return requestClient.put('/system/role', params);
}

/**
 * 新增角色
 */
export async function postRoleApi(params: RoleInfo) {
  return requestClient.post('/system/role', params);
}

/**
 * 删除角色
 */
export async function deleteRoleApi(roleId: number) {
  return requestClient.delete(`/system/role/${roleId}`);
}
