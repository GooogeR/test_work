<template>
    <div>
      <a-table :columns="columns" :dataSource="leads" class="custom-table">
        <template #bodyCell="{ column, text }">
          <span v-if="column.dataIndex === 'name'" class="table-cell-name">{{ text }}</span>
          <span v-else-if="column.dataIndex === 'price'" class="table-cell-price">{{ text }}</span>
          <span v-else-if="column.dataIndex === 'status'" class="table-cell-status">{{ text }}</span>
          <span v-else-if="column.dataIndex === 'responsible_user'" class="table-cell-responsible">{{ text }}</span>
          <span v-else-if="column.dataIndex === 'created_at'">{{ new Date(Number(text) * 1000).toLocaleDateString() }}</span>
          <span v-else-if="column.dataIndex === 'contacts'">
            <span v-if="text && text.length > 0">
              <span v-for="(contact, index) in text" :key="index" class="table-cell-contact">
                {{ contact.name }}: {{ contact.phone }}<br v-if="index < text.length - 1">
              </span>
            </span>
            <span v-else>-</span>
          </span>
        </template>
      </a-table>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { Table, TableColumnType } from 'ant-design-vue';
  import axios from 'axios';
  
  interface Contact {
    name: string;
    phone: string;
  }
  
  interface Lead {
    name: string;
    price: number;
    status: string;
    responsible_user: string;
    created_at: number;
    contacts: Contact[];
  }
  
  export default defineComponent({
    name: 'LeadsList',
    components: {
      'a-table': Table,
    },
    setup() {
      const leads = ref<Lead[]>([]);
      const columns = ref<TableColumnType<Lead>[]>([
        {
          title: 'Название',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: '200px',
        },
        {
          title: 'Бюджет',
          dataIndex: 'price',
          key: 'price',
          align: 'center',
          width: '100px',
        },
        {
          title: 'Статус',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          width: '150px',
        },
        {
          title: 'Ответственный',
          dataIndex: 'responsible_user',
          key: 'responsible_user',
          align: 'center',
          width: '200px',
        },
        {
          title: 'Дата создания',
          dataIndex: 'created_at',
          key: 'created_at',
          align: 'center',
          width: '150px',
        },
        {
          title: 'Контакты',
          dataIndex: 'contacts',
          key: 'contacts',
          align: 'center',
          width: '300px',
        },
      ]);
  
      onMounted(async () => {
        try {
          const response = await axios.get('/api/leads');
          leads.value = response.data._embedded.leads.map((lead: any) => ({
            name: lead.name,
            price: lead.price,
            status: lead.status,
            responsible_user: lead.responsible_user,
            created_at: lead.created_at,
            contacts: lead.contacts,
          }));
        } catch (error) {
          console.error('Ошибка при получении сделок:', error);
        }
      });
  
      return {
        leads,
        columns,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
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
  
  .custom-table .table-cell-name {
    font-weight: bold;
    color: #2c3e50;
  }
  
  .custom-table .table-cell-price {
    color: #e74c3c;
  }
  
  .custom-table .table-cell-status {
    color: #3498db;
    font-style: italic;
  }
  
  .custom-table .table-cell-responsible {
    color: #16a085;
  }
  
  .custom-table .table-cell-contact {
    color: #8e44ad;
  }
  </style>
  