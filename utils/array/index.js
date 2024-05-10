const _ = require("lodash");


// 数组转化：扁平化数组——>树形数组
// async function listToTree(list, key = "id", parentKey = "parent_id") {
//   const tree = [];
//   const mappedList = _.mapValues(_.keyBy(list, key), (item) => {
//     item.children = [];
//     return item;
//   });

//   _.forEach(mappedList, (item) => {
//     if (!item[parentKey]) {
//       tree.push(item);
//     } else {
//       mappedList[item[parentKey]].children.push(item);
//     }
//   });

//   return tree;
// }


function listToTree(list,key='id',parentKey='parent_id') {
    let map = {}, node, tree = [], i;
    for (i = 0; i < list.length; i++) {
      map[list[i].id] = i; // 初始化映射
      list[i].children = []; // 初始化children数组
    }
    for (i = 0; i < list.length; i++) {
      node = list[i];
      if (node.parent_id !== undefined && node.parent_id !== null && node.parent_id !== ''&& node.parent_id !== 0) {
        // 如果当前节点有父节点
        list[map[node.parent_id]].children.push(node);
      } else {
        // 如果没有父节点，则为根节点
        tree.push(node);
      }
    }
    return tree;
  }
module.exports = {
  listToTree,
};
