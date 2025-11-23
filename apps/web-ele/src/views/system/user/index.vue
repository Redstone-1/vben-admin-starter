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
import { deleteUserApi, postUserApi, putUserApi } from './api';
import { getGridOptions } from './constant';

const searchForm = reactive({
  userName: '',
  status: '',
});
const gridApiRef = ref();
const gridOptions = getGridOptions(searchForm, gridApiRef);
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AddForm,
  title: '新增用户',
  onConfirm: async () => {
    const { addForm, addFormRef, row } = modalApi.getData();

    await addFormRef.value.validate((valid: boolean) => {
      if (valid) {
        modalApi.lock();

        (row ? putUserApi : postUserApi)({
          ...addForm,
          nickName: addForm.userName,
          roleIds: [addForm.roleIds || undefined],
          remark: addForm.roleIds === 1 ? '管理员' : '普通用户',
          userId: row?.userId || undefined,
        })
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

async function deleteUser(userId: number) {
  await gridApi.grid?.clearEdit();

  gridApi.setLoading(true);
  await deleteUserApi(userId);
  await gridApi.query();
  gridApi.setLoading(false);
}
</script>

<template>
  <div class="system-user flex h-full flex-col p-5">
    <!-- template 下必须有一个根标签，Modal 必须在根标签下 -->
    <Modal />

    <div
      class="bg-card text-card-foreground border-border w-full rounded-xl border p-5"
    >
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem label="用户名">
          <ElInput v-model="searchForm.userName" placeholder="请填写用户名" />
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
            <ElButton type="text" @click="openModal(row)"> 编辑 </ElButton>
            <ElPopconfirm title="确定删除吗?" @confirm="deleteUser(row.userId)">
              <template #reference>
                <ElButton
                  class="delete-btn"
                  type="text"
                  v-if="row.userId !== 1"
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
.system-user {
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
