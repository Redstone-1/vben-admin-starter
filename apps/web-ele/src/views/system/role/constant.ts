import type { VxeGridProps } from '@vben/plugins/vxe-table';
import type { RoleInfo } from '@vben/types';

import { h } from 'vue';

import { ElSwitch } from 'element-plus';

import { changeStatusApi, getRoleListApi } from './api';

export type RowType = RoleInfo;

export const getGridOptions = (searchForm: any, gridApiRef: any) => {
  const gridOptions: VxeGridProps<RowType> = {
    columns: [
      {
        field: 'roleName',
        title: '角色名称',
        slots: {
          default: ({ row }: { row: RowType }) => {
            return h(
              'div', // 组件名称（全局注册的名称）
              {
                // 组件属性
                modelValue: row.roleName, // 绑定行数据的 roleName 字段
                style: {
                  fontSize: '14px',
                  fontWeight: 'bold',
                },
                textContent: row.roleName,
              },
              // 可选：组件插槽（el-switch 无默认插槽，可省略）
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
                    roleId: row.roleId,
                    status: val,
                  });
                  gridApiRef.value?.query();
                },
                disabled: row.roleId === 1,
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
            roleName: searchForm.roleName,
          };

          if (searchForm.status === '') {
            delete params.status;
          }

          if (searchForm.roleName === '') {
            delete params.roleName;
          }

          const res = await getRoleListApi(params);

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

export interface AddForm {
  roleName: string;
  deptIds: number[];
  menuIds: number[];
  roleKey: string;
  roleSort: number;
  status: string;
  remark: string;
  menuCheckStrictly: boolean;
  menuTree?: any[];
}

export const addFormInitValue: AddForm = {
  roleName: '',
  status: '',
  remark: '',
  menuCheckStrictly: true,
  deptIds: [],
  menuIds: [],
  roleKey: '',
  roleSort: 2,
};
