import type { Ref } from 'vue';

import type { VxeGridProps } from '@vben/plugins/vxe-table';
import type { MenuInfo } from '@vben/types';

import { h } from 'vue';

import { ElTag } from 'element-plus';

import { flattenTreeMenu, genMenuTree } from '#/utils/genMenuTree';

import { getMenuListApi } from './api';

export type RowType = MenuInfo;

export const getGridOptions = (searchForm: any, listRef: Ref<MenuInfo[]>) => {
  const gridOptions: VxeGridProps<RowType> = {
    columns: [
      {
        field: 'menuName',
        title: '菜单名称',
        align: 'left',
        treeNode: true,
        slots: {
          default: ({ row }: { row: RowType }) => {
            return h(
              'div', // 组件名称（全局注册的名称）
              {
                // 组件属性
                modelValue: row.menuName, // 绑定行数据的 menuName 字段
                style: {
                  fontSize: '14px',
                  fontWeight: 'bold',
                },
                textContent: row.menuName,
              },
              // 可选：组件插槽（el-switch 无默认插槽，可省略）
            );
          },
        },
      },
      {
        title: '状态',
        align: 'left',
        slots: {
          default: ({ row }: { row: RowType }) => {
            return h(
              ElTag, // 组件名称（全局注册的名称）
              {
                // 组件属性
                textContent: row.status === '0' ? '正常' : '停用', // 绑定行数据的 status 字段
                type: row.status === '0' ? 'success' : 'danger',
                size: 'small',
              },
            );
          },
        },
      },
      {
        title: '对应组件',
        field: 'component',
        align: 'left',
      },
      {
        title: '图标',
        field: 'icon',
        align: 'left',
      },
      {
        title: '排序序号',
        field: 'orderNum',
        align: 'left',
      },
      {
        title: '路径',
        field: 'path',
        align: 'left',
      },
      {
        field: 'remark',
        title: '备注',
        align: 'left',
      },
      { slots: { default: 'action' }, title: '操作' },
    ],
    editConfig: {
      mode: 'row',
      trigger: 'click',
    },
    treeConfig: {
      parentField: 'parentId',
      rowField: 'menuId',
      transform: true,
    },
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          const params = {
            status: searchForm.status,
            menuName: searchForm.menuName,
          };

          if (searchForm.status === '') {
            delete params.status;
          }

          if (searchForm.menuName === '') {
            delete params.menuName;
          }

          const res = await getMenuListApi(params);

          if (!res) {
            return {
              total: 0,
              items: [],
            };
          }

          const menuTree = genMenuTree(res);
          const flatMenuTree = flattenTreeMenu(menuTree);
          listRef.value = flatMenuTree;

          return {
            total: res.length,
            items: flatMenuTree,
          };
        },
      },
    },
    showOverflow: true,
  };

  return gridOptions;
};

export interface AddForm {
  menuName: string;
  menuType: string;
  status: string;
  remark: string;
  parentMenu: string;
  parentId: number;
  icon: string;
  path: string;
  orderNum: number;
  component: string;
  visible: '0' | '1';
}

export const addFormInitValue: AddForm = {
  menuName: '',
  menuType: 'C',
  status: '',
  remark: '',
  parentMenu: '根菜单',
  parentId: 0,
  icon: '',
  path: '',
  orderNum: 1,
  component: '',
  visible: '0',
};
