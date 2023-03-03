<template>
  <div class="side-bar">
    <a-input-search class="search" v-model="searchKey" />
    <a-tree :checkable="true" v-model:checked-keys="checkedKeys" :checked-strategy="checkedStrategy" :data="treeData"
      showLine>
      <template #extra="nodeData">
        <IconPlus style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"
          @click="() => onIconClick(nodeData)" />
      </template>
    </a-tree>
  </div>
</template>

<script setup lang="ts">
const searchKey = ref('');
const checkedKeys = ref([]);
const checkedStrategy = ref('all');

const originTreeData = [
  {
    title: 'Trunk 0-0',
    key: '0-0',
    children: [
      {
        title: 'Leaf',
        key: '0-0-1',
      },
      {
        title: 'Branch 0-0-2',
        key: '0-0-2',
        children: [
          {
            title: 'Leaf',
            key: '0-0-2-1'
          }
        ]
      },
    ],
  },
  {
    title: 'Trunk 0-1',
    key: '0-1',
    children: [
      {
        title: 'Branch 0-1-1',
        key: '0-1-1',
        children: [
          {
            title: 'Leaf',
            key: '0-1-1-1',
          },
          {
            title: 'Leaf',
            key: '0-1-1-2',
          },
        ]
      },
      {
        title: 'Leaf',
        key: '0-1-2',
      },
    ],
  },
];

const treeData = computed(() => {
  if (!searchKey.value) return originTreeData;
  return searchData(searchKey.value);
})

const strategyOptions = [
  {
    value: 'all',
    label: 'show all'
  },
  {
    value: 'parent',
    label: 'show parent'
  },
  {
    value: 'child',
    label: 'show child'
  }
];

// 遍历树，找到匹配的节点
function searchData(keyword: string) {
  const loop = (data: any[]) => {
    const result: any[] = [];
    data.forEach(item => {
      if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({ ...item });
      } else if (item.children) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result;
  }

  return loop(originTreeData);
}

// 获取匹配的索引
function getMatchIndex(title: string) {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
}

function onIconClick(nodeData: any) {
  const children = nodeData.children || []
  children.push({
    title: 'new tree node',
    key: nodeData.key + '-' + (children.length + 1)
  })
  nodeData.children = children

  treeData.value = [...treeData.value];
}

</script>

<style lang="less" scoped>
.side-bar {
  .search {
    margin-bottom: 8px;
    width: 100%;
  }
}
</style>