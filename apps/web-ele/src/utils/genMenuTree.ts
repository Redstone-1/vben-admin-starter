import type { MenuInfo } from '@vben/types';

// 定义树形菜单节点类型（继承基础类型并添加children）
interface TreeMenuItem extends MenuInfo {
  children: TreeMenuItem[];
  treeNode?: boolean;
}

/**
 * 将扁平的菜单数组转换为树形结构（支持指定保留的层级）
 * @param flatMenus 扁平的菜单数组
 * @param rootParentId 根节点的parentId（默认0）
 * @param includeLevels 需要保留的层级数组（可选，默认保留所有层级）
 * @returns 树形结构的菜单数组
 */
export function genMenuTree(
  flatMenus: MenuInfo[],
  rootParentId: number = 0,
  includeLevels?: number[], // 改为可选参数，不传递则为undefined
): TreeMenuItem[] {
  // 1. 创建menuId到菜单对象的映射，方便快速查找父节点
  const menuMap = new Map<number, TreeMenuItem>();

  // 2. 初始化映射并为每个菜单添加children属性
  flatMenus.forEach((menu) => {
    menuMap.set(menu.menuId, { ...menu, children: [] });
  });

  // 3. 构建树形结构（带层级过滤）
  const tree: TreeMenuItem[] = [];

  // 辅助函数：获取节点的层级（递归查找父节点直到根节点）
  const getNodeLevel = (menuId: number, currentLevel = 1): number => {
    const menu = menuMap.get(menuId);
    if (!menu || menu.parentId === rootParentId) {
      return currentLevel;
    }
    return getNodeLevel(menu.parentId, currentLevel + 1);
  };

  menuMap.forEach((menu) => {
    const parentId = menu.parentId;
    // 如果是根节点，直接加入树形数组
    if (parentId === rootParentId) {
      tree.push(menu);
    } else {
      // 查找父节点并判断当前节点是否在保留层级内
      const parentMenu = menuMap.get(parentId);
      if (parentMenu) {
        // 未指定层级时，直接添加；指定层级时，仅添加层级匹配的节点
        if (includeLevels) {
          const currentLevel = getNodeLevel(menu.menuId);
          if (!includeLevels.includes(currentLevel)) {
            return;
          }
        }
        parentMenu.children.push(menu);
      }
    }
  });

  // 4. 递归排序子节点（按orderNum升序）+ 过滤超出层级的子节点
  const sortAndFilterChildren = (
    menuNode: TreeMenuItem,
    currentLevel: number = 1,
  ) => {
    // 排序当前节点的子节点
    menuNode.children.sort((a, b) => a.orderNum - b.orderNum);

    // 仅当指定了层级时，才过滤子节点
    if (includeLevels) {
      const nextLevel = currentLevel + 1;
      menuNode.children = menuNode.children.filter(() => {
        return includeLevels.includes(nextLevel);
      });
    }

    // 递归处理子节点（未指定层级时全量递归，指定层级时仅递归保留层级内的节点）
    if (!includeLevels || includeLevels.includes(currentLevel)) {
      menuNode.children.forEach((child) =>
        sortAndFilterChildren(child, currentLevel + 1),
      );
    }
  };

  // 对根节点及其子节点进行排序和过滤
  tree.sort((a, b) => a.orderNum - b.orderNum);
  tree.forEach((node) => sortAndFilterChildren(node));

  return tree;
}

/**
 * 将树形菜单结构拍平为扁平数组（支持指定保留的层级）
 * @param treeMenus 树形菜单数组
 * @param removeChildren 是否移除children字段（默认true，还原为原始扁平结构）
 * @param includeLevels 需要保留的层级数组（可选，默认保留所有层级）
 * @returns 扁平的菜单数组
 */
export function flattenTreeMenu(
  treeMenus: TreeMenuItem[],
  removeChildren: boolean = true,
  includeLevels?: number[], // 改为可选参数，不传递则为undefined
): MenuInfo[] {
  const flatList: MenuInfo[] = [];

  // 递归遍历树形结构（带层级过滤）
  const traverse = (node: TreeMenuItem, currentLevel: number = 1) => {
    // 仅当指定了层级且当前层级不在范围内时，才跳过
    if (includeLevels && !includeLevels.includes(currentLevel)) {
      return;
    }

    // 复制节点对象，避免修改原数据
    const nodeCopy = { ...node };

    // 如果需要移除children字段，删除该属性
    if (removeChildren) {
      delete (nodeCopy as Partial<TreeMenuItem>).children;
    }

    // 将当前节点加入扁平数组
    flatList.push(nodeCopy as MenuInfo);

    // 递归遍历子节点
    if (node.children && node.children.length > 0) {
      const nextLevel = currentLevel + 1;
      // 未指定层级时遍历所有子节点，指定层级时仅遍历下一层级在范围内的子节点
      const childrenToTraverse = includeLevels
        ? node.children.filter(() => includeLevels.includes(nextLevel))
        : node.children;

      childrenToTraverse.forEach((child) => traverse(child, nextLevel));
    }
  };

  // 遍历所有根节点
  treeMenus.forEach((rootNode) => traverse(rootNode));

  return flatList;
}
