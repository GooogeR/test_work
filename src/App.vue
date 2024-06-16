<!-- App.vue -->
<template>
  <div id="app">
    <LeadsList />
  </div>
</template>

<script>
import LeadsList from './components/LeadsList.vue';

export default {
  name: 'App',
  components: {
    LeadsList,
  },
};
</script>

<style lang="scss">
.custom-table {
  margin-top: 20px;
  font-size: 14px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-table .ant-table-thead > tr > th {
  background-color: #f0f2f5;
  text-align: center;
  font-weight: bold;
  padding: 12px;
  color: #333;
  font-size: 16px;
}

.custom-table .ant-table-tbody > tr > td {
  text-align: center;
  padding: 10px;
  font-size: 14px;
  color: #555;
}
</style>
