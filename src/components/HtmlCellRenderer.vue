<template>
    <div v-html="content"></div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'HtmlCellRenderer',
    props: {
      content: {
        type: String,
        required: true,
      },
    },
  });
  </script>
  