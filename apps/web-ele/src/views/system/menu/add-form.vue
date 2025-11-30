<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import type { MenuInfo } from '@vben/types';

import type { AddForm } from './constant';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRadioGroup,
} from 'element-plus';

import { addFormInitValue } from './constant';

defineOptions({
  name: 'AddForm',
});

const addForm = reactive<AddForm>(Object.assign({}, addFormInitValue));
const addFormRef = ref<FormInstance>();
const [Modal, modalApi] = useVbenModal({
  onOpened: () => {
    const { row, menuList } = modalApi.getData();

    if (row) {
      addForm.parentMenu =
        menuList.find((item: MenuInfo) => item.menuId === row.parentId)
          ?.menuName || '根菜单';
      addForm.menuName = row.menuName;
      addForm.menuType = row.menuType || 'C';
      addForm.status = row.status;
      addForm.remark = row.remark || '';
      addForm.parentId = row.parentId || 0;
      addForm.icon = row.icon || '';
      addForm.path = row.path || '';
      addForm.orderNum = row.orderNum || '';
      addForm.component = row.component || '';
      addForm.visible = row.visible || true;
    } else {
      addForm.parentMenu = '根菜单';
      addForm.menuName = '';
      addForm.menuType = 'C';
      addForm.status = '';
      addForm.remark = '';
      addForm.parentId = 0;
      addForm.icon = '';
      addForm.path = '';
      addForm.orderNum = 1;
      addForm.component = '';
      addForm.visible = '0';
    }
  },
});

modalApi.setData({
  addFormRef,
  addForm,
});

const rules = reactive<FormRules>({
  menuName: [
    { required: true, message: '请输入菜单名', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '菜单名长度必须在2到10位之间',
      trigger: 'blur',
    },
  ],
  icon: [
    {
      required: true,
      message: '请输入菜单图标',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 100,
      message: '菜单图标长度必须在2到100位之间',
      trigger: 'blur',
    },
  ],
  path: [
    {
      required: true,
      message: '请输入路由地址',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 100,
      message: '路由地址长度必须在2到100位之间',
      trigger: 'blur',
    },
  ],
  orderNum: [
    {
      required: true,
      message: '请输入显示排序',
      trigger: 'blur',
    },
  ],
  component: [
    {
      required: true,
      message: '请输入组件路径',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 100,
      message: '组件路径长度必须在2到100位之间',
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
    <div class="add-form h-full flex-col pl-3 pr-5 pt-3">
      <ElForm
        ref="addFormRef"
        :model="addForm"
        :rules="rules"
        label-width="80px"
      >
        <ElFormItem label="菜单名" prop="menuName">
          <ElInput v-model="addForm.menuName" placeholder="请输入菜单名" />
        </ElFormItem>
        <ElFormItem label="上级菜单" prop="parentMenu">
          <ElInput v-model="addForm.parentMenu" disabled />
        </ElFormItem>
        <ElFormItem label="菜单图标" prop="icon">
          <ElInput v-model="addForm.icon" placeholder="请输入菜单图标" />
        </ElFormItem>
        <ElFormItem label="路由地址" prop="path">
          <ElInput
            v-model="addForm.path"
            placeholder="路由地址，例如：/system/menu"
          />
        </ElFormItem>
        <ElFormItem label="显示排序" prop="orderNum">
          <ElInputNumber
            v-model="addForm.orderNum"
            :min="1"
            :max="100"
            placeholder="菜单的显示顺序，只能是数字"
          />
        </ElFormItem>
        <ElFormItem label="组件路径" prop="component">
          <ElInput v-model="addForm.component" placeholder="请输入组件路径" />
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElRadioGroup v-model="addForm.status">
            <ElRadio label="正常" value="0" />
            <ElRadio label="停用" value="1" />
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="是否显示" prop="visible">
          <ElRadioGroup v-model="addForm.visible">
            <ElRadio label="显示" value="0" />
            <ElRadio label="不显示" value="1" />
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
          <ElInput v-model="addForm.remark" placeholder="请输入备注" />
        </ElFormItem>
      </ElForm>
    </div>
  </Modal>
</template>

<style scoped lang="scss"></style>
