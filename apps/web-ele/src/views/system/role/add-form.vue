<script lang="ts" setup>
import type {
  FormInstance,
  FormRules,
  TreeInstance,
  TreeNode,
} from 'element-plus';

import type { AddForm } from './constant';

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
  ElTree,
} from 'element-plus';

import { getRoleMenuTreeSelectApi } from './api';
import { addFormInitValue } from './constant';

defineOptions({
  name: 'AddForm',
});

const addForm = reactive<AddForm>(Object.assign({}, addFormInitValue));
const addFormRef = ref<FormInstance>();
const treeRef = ref<TreeInstance>();
const [Modal, modalApi] = useVbenModal({
  onOpened: async () => {
    const { row } = modalApi.getData();

    const tree = await getRoleMenuTreeSelectApi(row?.roleId ?? '');

    if (row) {
      const { menus = [], checkedKeys = [] } = tree || {};
      addForm.menuTree = menus;
      addForm.menuIds = checkedKeys || [];
      addForm.roleName = row.roleName;
      addForm.roleKey = row.roleKey || '';
      addForm.roleSort = row.roleSort || 2;
      addForm.status = row.status;
      addForm.remark = row.remark || '';
      addForm.menuCheckStrictly = row.menuCheckStrictly || true;

      treeRef.value!.setCheckedKeys(checkedKeys, false);
    } else {
      addForm.menuTree = tree ?? [];
      addForm.menuIds = [];
      addForm.roleName = '';
      addForm.roleKey = '';
      addForm.roleSort = 2;
      addForm.status = '';
      addForm.remark = '';
      addForm.menuCheckStrictly = true;
    }

    return true;
  },
});

modalApi.setData({
  addFormRef,
  addForm,
});

const handleCheck = (
  node: TreeNode,
  checkedInfo: { checkedKeys: number[] },
) => {
  addForm.menuIds = checkedInfo.checkedKeys || [];
};

const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: '请输入角色名', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '角色名长度必须在2到10位之间',
      trigger: 'blur',
    },
  ],
  roleKey: [
    {
      required: true,
      message: '请选择权限字符',
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
        <ElFormItem label="角色名" prop="roleName">
          <ElInput v-model="addForm.roleName" />
        </ElFormItem>
        <ElFormItem label="权限字符" prop="roleKey">
          <ElSelect v-model="addForm.roleKey" placeholder="请选择权限字符">
            <ElOption label="superadmin" value="superadmin" />
            <ElOption label="common" value="common" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="角色" prop="menuIds">
          <ElTree
            v-model="addForm.menuIds"
            ref="treeRef"
            style="width: 100%"
            show-checkbox
            :data="addForm.menuTree"
            :props="{
              children: 'children',
              label: 'label',
            }"
            node-key="id"
            highlight-current
            :check-strictly="true"
            @check="handleCheck"
          />
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElRadioGroup v-model="addForm.status">
            <ElRadio label="正常" value="0" />
            <ElRadio label="停用" value="1" />
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
          <ElInput v-model="addForm.remark" />
        </ElFormItem>
      </ElForm>
    </div>
  </Modal>
</template>

<style scoped lang="scss"></style>
