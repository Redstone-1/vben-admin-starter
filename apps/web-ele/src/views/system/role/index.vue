<script lang="ts" setup>
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
import { deleteRoleApi, postRoleApi, putRoleApi } from './api';
import { getGridOptions } from './constant';

const searchForm = reactive({
  roleName: '',
  status: '',
});
const gridApiRef = ref();
const gridOptions = getGridOptions(searchForm, gridApiRef);
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AddForm,
  title: '新增角色',
  onConfirm: async () => {
    const { addForm, addFormRef, row } = modalApi.getData();

    await addFormRef.value.validate((valid: boolean) => {
      if (valid) {
        modalApi.lock();
        const params = row
          ? { ...row, ...addForm }
          : {
              ...addForm,
              roleSort: 2,
              delFlag: '0',
              deptCheckStrictly: false,
              menuCheckStrictly: true,
            };

        (row ? putRoleApi : postRoleApi)(params)
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

gridApiRef.value = gridApi;

const openModal = (row?: RowType) => {
  modalApi.setData({
    ...modalApi.getData(),
    row,
  });

  modalApi.open();
};

const onSearch = () => {
  gridApi?.query();
};

async function deleteRole(roleId: number) {
  await gridApi.grid?.clearEdit();

  gridApi.setLoading(true);
  await deleteRoleApi(roleId);
  await gridApi.query();
  gridApi.setLoading(false);
}
</script>

<template>
  <div class="system-role flex h-full flex-col p-5">
    <!-- template 下必须有一个根标签，Modal 必须在根标签下 -->
    <Modal />

    <div
      class="bg-card text-card-foreground border-border w-full rounded-xl border p-5"
    >
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem label="角色名">
          <ElInput v-model="searchForm.roleName" placeholder="请填写角色名" />
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
        <ElButton type="primary" @click="openModal()">新增</ElButton>
      </ElSpace>
    </div>

    <div class="mt-5 h-full flex-1">
      <Grid>
        <template #action="{ row }">
          <ElSpace>
            <ElButton
              type="text"
              @click="openModal(row)"
              :disabled="row.roleId === 1"
            >
              编辑
            </ElButton>
            <ElPopconfirm title="确定删除吗?" @confirm="deleteRole(row.roleId)">
              <template #reference>
                <ElButton
                  class="delete-btn"
                  type="text"
                  v-if="row.roleId !== 1"
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
.system-role {
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
