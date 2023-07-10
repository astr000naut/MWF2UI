<template>
  <div class="pcontent">
    <div class="pcontent__tab">
      <div
        class="tab"
        :class="[route.path.includes('CAProcess') ? 'tab--selected' : '']"
        @click="processTabOnClick"
      >
        Quy trình
      </div>
      <div
        class="tab"
        @click="receiptTabOnClick"
        :class="[route.path.includes('CAReceipt') ? 'tab--selected' : '']"
      >
        Thu, chi tiền
      </div>
    </div>
    <div class="pcontent__main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

function processTabOnClick() {
  router.replace("/CA/CAProcess");
}

function receiptTabOnClick() {
  router.replace("/CA/CAReceipt");
}
</script>

<style
  scoped
  lang="css"
  src="../../../css/components/views/cash/cash-page.css"
></style>
