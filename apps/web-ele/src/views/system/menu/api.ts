import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户列表
 */
export async function getUserListApi(params: {
  pageNum: number;
  pageSize: number;
  status?: string;
  userName?: string;
}) {
  return requestClient.get('/system/user/list', { ...params, deptId: 100 });
}

/**
 * 获取用户列表
 */
export async function getUserApi(userId: number) {
  return requestClient.get(`/system/user/${userId}`);
}

/**
 * 改变用户状态
 */
export async function changeStatusApi(params: {
  status: string;
  userId: number;
}) {
  return requestClient.put('/system/user/changeStatus', params);
}

/**
 * 改变用户角色
 */
export async function changeUserRoleApi(params: {
  roleIds: number[];
  userId: number;
}) {
  return requestClient.put('/system/user/authRole', params);
}

/**
 * 更新用户信息
 */
export async function putUserApi(params: UserInfo) {
  return requestClient.put('/system/user', params);
}

/**
 * 新增用户
 */
export async function postUserApi(params: UserInfo) {
  return requestClient.post('/system/user', params);
}

/**
 * 新增用户
 */
export async function deleteUserApi(userId: number) {
  return requestClient.delete(`/system/user/${userId}`);
}
