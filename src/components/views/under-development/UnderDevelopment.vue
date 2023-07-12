<template>
  <div class="container">
    <div class="content">
      <BaseSelectbox
        :isActive="true"
        label=""
        pholder=""
        :isrequired="false"
        :option-list="optionList"
        noti=""
        v-model:selectedItemId="selectedItemId"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const selectedItemId = ref(-1);
const optionList = ref(["Nhà cung cấp", "Khách hàng", "Nhân viên"]);
</script>

<style
  scoped
  lang="css"
  src="../../../css/components/views/under-development/under-development.css"
></style>
