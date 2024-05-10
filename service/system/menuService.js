const { Op } = require("sequelize");
const _ = require("lodash");
const { sequelize } = require("../../utils/db-mysql");
const { Service } = require("../index");
const { Menu } = require("../../models/system/menuModel");
const { Role, RoleUser } = require("../../models/system/roleModel");
const { ParametersException } = require("../../exception/httpException");
const { RoleService } = require("./roleService");

class MenuService extends Service {
  constructor() {
    super();
  }
  // 获取路由
  async getRoutes(tokenPayload) {
    let roles = await new RoleService().getRolesByUserId(tokenPayload.id);
    let roleIds = roles.map((item) => {
      return item.id;
    });
    const menus = await this.getMenuListByRoleIds(roleIds);
    const trees = await this.arrayToTree(menus, 0);
    return trees;
  }
  // 获取菜单列表
  async getMenuList(params) {
    return new Promise(async (resolve) => {
      let whereObject = await this.getObject(params, ["name", "status"]);
      const menus = await Menu.findAll({
        where: whereObject,
        order:[
          ['order', 'ASC'],
        ]
      });
      const treeList = await this.toTree(menus, 0);
      resolve(treeList);
    });
  }
  // 组成路由对象树形结构
  toTree(arr, parent_id = 0) {
    const tree = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].parent_id === parent_id) {
        let menu = arr[i].toJSON();
        const children = this.toTree(arr, menu.id);
        if (children.length) {
          menu.children = children;
        }
        tree.push(menu);
      }
    }
    return tree;
  }

  // 新增菜单
  async create(params) {
    return await sequelize.transaction(async (t) => {
      if (params.parent_id) {
        const parentMenu = await Menu.findOne({
          where: {
            id: params.parent_id,
          },
        });
        if (parentMenu == null) {
          throw new ParametersException("上级菜单不存在，无法创建当前菜单！");
        }
      }
      params.create_by = true;
      let valueObject = await this.getObject(params, [
        "parent_id",
        "name",
        "type",
        "order",
        "path",
        "component",
        "icon",
        "permission",
        "current_active_menu",
        "is_frame",
        "is_cache",
        "visible",
        "status",
        "remark",
        "create_by",
      ]);
      return await Menu.create(valueObject, {
        transaction: t,
      });
    });
  }
  // 修改菜单
  async update(params) {
    return await sequelize.transaction(async (t) => {
      if (params.parent_id) {
        const parentMenu = await Menu.findOne({
          where: {
            id: params.parent_id,
          },
        });
        if (parentMenu == null) {
          throw new ParametersException("上级菜单不存在，无法创建当前菜单！");
        }
      }
      params.update_by = true;
      let valueObject = await this.getObject(params, [
        "parent_id",
        "name",
        "type",
        "order",
        "path",
        "component",
        "icon",
        "permission",
        "current_active_menu",
        "is_frame",
        "is_cache",
        "visible",
        "status",
        "remark",
        "update_by",
      ]);
      return await Menu.update(valueObject, {
        where: {
          id: params.id,
        },
        transaction: t,
      });
    });
  }
  // 删除菜单
  async del(id) {
    return await sequelize.transaction(async (t) => {
      const menus = await Menu.findAll({
        where: {
          parent_id: id,
        },
      });
      if (menus.length > 0) {
        throw new ParametersException("该菜单下存在子菜单，请先删除子菜单");
      }
      return await Menu.destroy({
        where: {
          id: id,
        },
      });
    });
  }
  // 查询菜单-树形结构
  async findAllTree(params) {
    return new Promise(async (resolve) => {
      let whereObject = await this.getObject(params, [
        "id",
        "parent_id",
        "name",
      ]);
      let menus = await Menu.findAll({
        where: whereObject,
        raw: true,
      });
      let list = [...menus];
      let treeList = [];
      if (list.length > 0) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          element.children = await this.getMenuChildren(element.id);
          treeList.push(element);
        }
      }
      resolve(treeList);
    });
  }
  // 获取菜单子集
  async getMenuChildren(parent_id) {
    return new Promise(async (resolve) => {
      let menus = await Menu.findAll({
        where: {
          parent_id: parent_id,
        },
        raw: true,
      });
      let list = [...menus];
      let treeList = [];
      if (list.length > 0) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          element.children = await this.getMenuChildren(element.id);
          treeList.push(element);
        }
      }
      resolve(treeList);
    });
  }

  // 组成路由对象树形结构
  arrayToTree(arr, parent_id = 0) {
    const tree = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].parent_id === parent_id) {
        let menu = arr[i].toJSON();
        let route = {
          path: menu.path,
          name: menu.name,
          component: menu.component,
          meta: {
            orderNo: menu.order,
            icon: menu.icon,
            title: menu.name,
            hideMenu: menu.visible == 0 ? false : true,
            showMenu: menu.visible == 0 ? true : false,
            ignoreKeepAlive: menu.is_cache == 0 ? true : false,
            currentActiveMenu: menu.current_active_menu,
          },
        };
        const children = this.arrayToTree(arr, menu.id);
        if (children.length) {
          route.children = children;
        }
        tree.push(route);
      }
    }
    return tree;
  }
  // 获取菜单清单-通过角色
  async getMenuListByRoleIds(roleIds) {
    return new Promise(async (resolve) => {
      let roleMenus = await Role.findAll({
        where: {
          id: {
            [Op.or]: roleIds,
          },
        },
        include: [
          {
            model: Menu,
            through: {
              attributes: [],
            },
            where: {
              status: 0,
            },
          },
        ],
      });
      let menus = roleMenus.map((item) => {
        return item.sys_menus;
      });
      let flattenMenus = _.flatten(menus);
      let reduceMenus = _.uniqBy(flattenMenus, "id");
      let orderMenus=_.orderBy(reduceMenus, ['order'], ['asc']);
      resolve(orderMenus);
    });
  }
}

module.exports = { MenuService };
