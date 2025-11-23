<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
} from 'element-plus';

defineOptions({
  name: 'AddForm',
});

interface AddForm {
  userName: string;
  password: string;
  roleIds: number | undefined;
  status: string;
  remark: string;
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: (isOpen) => {
    const { row } = modalApi.getData();
    if (isOpen && row) {
      addForm.userName = row.userName;
      addForm.roleIds = row.roles?.roleId || undefined;
      addForm.status = row.status;
      addForm.remark = row.remark;
    }
  },
});
const addFormRef = ref<FormInstance>();
const addForm = reactive<AddForm>({
  userName: '',
  password: '',
  roleIds: undefined,
  status: '',
  remark: '',
});

modalApi.setData({
  addFormRef,
  addForm,
});

const rules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '用户名长度必须在2到10位之间',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6到20位之间', trigger: 'blur' },
  ],
  roleIds: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'blur',
    },
  ],
  status: [
    {
      required: true,
      message: '请选择状态',
      trigger: 'blur',
    },
  ],
});
</script>

<template>
  <Modal>
    <div class="add-form h-full flex-col">
      <ElForm
        ref="addFormRef"
        :model="addForm"
        :rules="rules"
        label-width="80px"
      >
        <ElFormItem label="用户名" prop="userName">
          <ElInput v-model="addForm.userName" />
        </ElFormItem>
        <ElFormItem v-if="!modalApi.getData().row" label="密码" prop="password">
          <ElInput v-model="addForm.password" />
        </ElFormItem>
        <ElFormItem label="角色" prop="roleIds">
          <ElSelect v-model="addForm.roleIds" placeholder="请选择角色">
            <ElOption label="管理员" :value="1" />
            <ElOption label="普通用户" :value="2" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElRadioGroup v-model="addForm.status">
            <ElRadio label="正常" value="0" />
            <ElRadio label="停用" value="1" />
          </ElRadioGroup>
        </ElFormItem>
      </ElForm>
    </div>
  </Modal>
</template>

<style scoped lang="scss"></style>
