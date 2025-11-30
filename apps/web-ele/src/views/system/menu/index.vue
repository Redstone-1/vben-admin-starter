<script lang="ts" setup>
import type { MenuInfo } from '@vben/types';

import type { RowType } from './constant';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElPopconfirm,
  ElRadio,
  ElRadioGroup,
  ElSpace,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import AddForm from './add-form.vue';
import { deleteMenuApi, postMenuApi, putMenuApi } from './api';
import { getGridOptions } from './constant';

const modalTitle = ref('新增菜单');
const listRef = ref<MenuInfo[]>([]);
const searchForm = reactive({
  menuName: '',
  status: '',
});
const gridOptions = getGridOptions(searchForm, listRef);
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AddForm,
  title: modalTitle.value,
  onBeforeClose: () => {
    const { addFormRef } = modalApi.getData();
    addFormRef.value.resetFields();
    return true;
  },
  onConfirm: async () => {
    const { addForm, addFormRef, row, isAdd } = modalApi.getData();

    await addFormRef.value.validate((valid: boolean) => {
      if (valid) {
        modalApi.lock();
        const params = row
          ? { ...row, ...addForm }
          : {
              ...addForm,
              menuSort: 2,
              delFlag: '0',
              deptCheckStrictly: false,
              menuCheckStrictly: true,
            };

        (isAdd ? postMenuApi : putMenuApi)(params)
          .then(() => {
            modalApi.close();
            addFormRef.value.resetFields();
            gridApi?.query();
          })
          .catch(() => {
            modalApi.close();
          });
      }
    });
  },
});

const openModal = (
  row: RowType | undefined,
  isAdd: boolean = true,
  isAddChild = false,
) => {
  modalTitle.value = isAdd ? '新增菜单' : '编辑菜单';
  modalApi.setData({
    ...modalApi.getData(),
    row: {
      ...row,
      parentId: row ? (isAddChild ? row!.menuId : row!.parentId) : 0,
    },
    menuList: listRef.value,
  });

  modalApi.open();
};

const onSearch = () => {
  gridApi?.query();
};

async function deleteMenu(menuId: number) {
  try {
    await gridApi.grid?.clearEdit();

    gridApi.setLoading(true);
    await deleteMenuApi(menuId);
    await gridApi.query();
    gridApi.setLoading(false);
  } catch {
    gridApi.setLoading(false);
  }
}
</script>

<template>
  <div class="system-menu flex h-full flex-col p-5">
    <!-- template 下必须有一个根标签，Modal 必须在根标签下 -->
    <Modal />

    <div
      class="bg-card text-card-foreground border-border w-full rounded-xl border p-5"
    >
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem label="菜单名">
          <ElInput v-model="searchForm.menuName" placeholder="请填写菜单名" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="searchForm.status">
            <ElRadio label="全部" value="" />
            <ElRadio label="正常" value="0" />
            <ElRadio label="停用" value="1" />
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="onSearch">查询</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <div class="flex justify-start pl-1 pr-1 pt-5">
      <ElSpace size="small">
        <ElButton type="primary" @click="openModal(undefined)">新增</ElButton>
      </ElSpace>
    </div>

    <div class="mt-5 h-full flex-1">
      <Grid>
        <template #action="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="openModal(row, false)"
              v-if="row.menuId !== 1"
            >
              编辑
            </ElButton>
            <ElButton
              type="text"
              @click="openModal(row, true, true)"
              v-if="row.menuId !== 1"
            >
              新增子菜单
            </ElButton>
            <ElPopconfirm title="确定删除吗?" @confirm="deleteMenu(row.menuId)">
              <template #reference>
                <ElButton
                  class="delete-btn"
                  type="text"
                  v-if="row.menuId !== 1"
                >
                  删除
                </ElButton>
              </template>
            </ElPopconfirm>
          </ElSpace>
        </template>
      </Grid>
    </div>
  </div>
</template>

<style scoped lang="scss">
.system-menu {
  .el-form-item {
    margin-bottom: 0;
  }

  .el-button--text {
    font-size: 12px;
    font-weight: bold !important;
  }

  .delete-btn {
    font-weight: bold;
    color: #f56c6c;
  }
}
</style>
