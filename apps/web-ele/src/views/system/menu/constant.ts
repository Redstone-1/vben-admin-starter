import type { VxeGridProps } from '@vben/plugins/vxe-table';
import type { UserInfo } from '@vben/types';

import { h } from 'vue';

import { ElOption, ElSelect, ElSwitch } from 'element-plus';

import { changeStatusApi, changeUserRoleApi, getUserListApi } from './api';

export interface RowType extends UserInfo {
  userName: string;
  status: string;
  remark: string;
}

export const getGridOptions = (searchForm: any, gridApiRef: any) => {
  const gridOptions: VxeGridProps<RowType> = {
    columns: [
      {
        field: 'userName',
        title: '用户名',
        slots: {
          default: ({ row }: { row: RowType }) => {
            return h(
              'div', // 组件名称（全局注册的名称）
              {
                // 组件属性
                modelValue: row.userName, // 绑定行数据的 status 字段
                style: {
                  fontSize: '14px',
                  fontWeight: 'bold',
                },
                textContent: row.userName,
              },
              // 可选：组件插槽（el-switch 无默认插槽，可省略）
            );
          },
        },
      },
      {
        title: '角色',
        slots: {
          default: ({ row }: { row: RowType }) => {
            // 确保 row.roles 和 row.roles.roleId 存在，避免渲染错误
            const roleId = row.roles?.roleId || '';

            return h(
              ElSelect, // 组件名称（全局注册的名称）
              {
                // 组件属性
                modelValue: roleId, // 绑定行数据的 roleId 字段
                // 事件绑定（@change 对应组件的 change 事件）
                onChange: async (val: any) => {
                  await changeUserRoleApi({
                    roleIds: [val],
                    userId: row.userId,
                  });
                  gridApiRef.value?.query();
                },
                disabled: row.userId === 1,
              },
              // 使用子组件 ElOption 来定义下拉选项
              () => [
                h(ElOption, { label: '管理员', value: 1 }),
                h(ElOption, { label: '普通用户', value: 2 }),
              ],
            );
          },
        },
      },
      {
        title: '状态',
        slots: {
          default: ({ row }: { row: RowType }) => {
            return h(
              ElSwitch, // 组件名称（全局注册的名称）
              {
                // 组件属性
                modelValue: row.status, // 绑定行数据的 status 字段
                activeValue: '0', // 开启对应值（与后端一致）
                inactiveValue: '1', // 关闭对应值
                size: 'small',
                // 事件绑定（@change 对应组件的 change 事件）
                onChange: async (val: any) => {
                  await changeStatusApi({
                    status: val,
                    userId: row.userId,
                  });
                  gridApiRef.value?.query();
                },
                disabled: row.userId === 1,
              },
              // 可选：组件插槽（el-switch 无默认插槽，可省略）
            );
          },
        },
      },
      {
        field: 'remark',
        title: '备注',
      },
      { slots: { default: 'action' }, title: '操作' },
    ],
    editConfig: {
      mode: 'row',
      trigger: 'click',
    },
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const params = {
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            status: searchForm.status,
            userName: searchForm.userName,
          };

          if (searchForm.status === '') {
            delete params.status;
          }

          const res = await getUserListApi(params);

          if (!res) {
            return {
              total: 0,
              items: [],
            };
          }

          return {
            total: res.total,
            items: res.list,
          };
        },
      },
    },
    showOverflow: true,
  };

  return gridOptions;
};
