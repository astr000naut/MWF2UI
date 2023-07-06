<template>
  <div class="container">
    <div class="content">
      <BaseComboboxTable
        label="Nhân viên bán hàng"
        v-model:selectedItemId="customer.employeeId"
        v-model:selectedItemName="customer.employeeFullName"
        :tableSchema="tableSchema"
        :itemSchema="itemSchema"
        :fetchApi="fetchApi"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseComboboxTable from "@/components/base/BaseComboboxTable.vue";
const customer = ref({
  employeeId: "",
  employeeFullName: "",
});
const tableSchema = [
  {
    name: "Mã nhân viên",
    prop: "employeeCode",
    width: 40,
  },
  {
    name: "Tên nhân viên",
    prop: "employeeFullName",
    width: 60,
  },
];
const itemSchema = ["employeeId", "employeeCode", "employeeFullName"];
const fetchApi = "https://localhost:44381/api/v1/Employees/Filter";
</script>

<style
  scoped
  lang="css"
  src="../../../css/components/views/under-development/under-development.css"
></style>
