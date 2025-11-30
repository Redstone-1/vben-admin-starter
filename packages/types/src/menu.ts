export interface MenuInfo {
  component: string;
  delFlag: '0' | '1';
  icon: string;
  isCache: '0' | '1';
  isFrame: '0' | '1';
  menuId: number;
  menuName: string;
  menuType: string;
  orderNum: number;
  parentId: number;
  path: string;
  perms: string;
  query: string;
  remark: string;
  status: '0' | '1';
  visible: '0' | '1';
}
