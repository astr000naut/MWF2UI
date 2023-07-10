<template>
  <div class="scb">
    <div class="scb__label">Mã khách hàng</div>
    <div class="scb__main" :class="[isTableOpen ? 'active' : '']">
      <div class="main__selected">
        <div class="selected__input">
          <input
            type="text"
            ref="refInput"
            :value="selectedEmployeeName"
            @input="$emit('update:selectedEmployeeName', $event.target.value)"
            @keyup="inputKeyupHandler"
            @keypress="inputKeyPressHandler"
          />
        </div>
      </div>
      <div class="main__action">
        <div class="btn__add">
          <div class="btn__add__icon mi mi-12 mi-add--green"></div>
        </div>
        <button class="btn__dropdown" @click="btnDropDownOnClick">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
    </div>
    <div class="scb__table" v-show="isTableOpen">
      <div class="table__header">
        <table class="t__header">
          <thead>
            <tr>
              <th
                v-for="header in tableStructure"
                :key="header.name"
                :style="{
                  width: header.width != 0 ? header.width + 'px' : 'auto',
                }"
              >
                <div :class="header.align">
                  {{ header.name }}
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div
        class="table__content"
        @scroll="tableContentOnScroll($event)"
        ref="talbeContentRef"
      >
        <div class="t__loader" v-show="isLoadingData">
          <BaseLoader />
        </div>
        <table class="t__content" v-show="!isLoadingData">
          <tbody>
            <tr
              v-for="(entity, index) in entityList"
              :key="index"
              @click="trOnClick(index)"
              :class="[
                entity[entityStructure.id] == selectedEmployeeId
                  ? 'selected'
                  : '',
              ]"
            >
              <td
                v-for="header in tableStructure"
                :key="header.prop"
                :style="{
                  width: header.width != 0 ? header.width + 'px' : 'auto',
                }"
              >
                <div class="td__text">{{ entity[header.prop] }}</div>
              </td>
            </tr>
            <tr v-show="entityList.length == 0">
              <div class="no__data">Không có dữ liệu</div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick } from "vue";
import $api from "@/js/api";
import BaseLoader from "@/components/base/BaseLoader.vue";
const refInput = ref(null);
const isTableOpen = ref(false);
const $axios = inject("$axios");
const entityList = ref([]);
const typingTimers = [];
const timeoutVal = 500;
const isLoadingData = ref(false);
const talbeContentRef = ref(null);
const selectedEmployeeIndex = ref(0);

const props = defineProps({
  selectedEmployeeId: String,
  selectedEmployeeName: String,
});
const emits = defineEmits([
  "update:selectedEmployeeId",
  "update:selectedEmployeeName",
]);

const entityStructure = {
  id: "customerId",
  code: "customerCode",
};

const tableStructure = [
  {
    name: "Đối tượng",
    prop: "customerCode",
    align: "text-left",
    width: 100,
  },
  {
    name: "Tên đối tượng",
    prop: "customerFullName",
    align: "text-left",
    width: 300,
  },
  {
    name: "Mã số thuế",
    prop: "customerTIN",
    align: "text-left",
    width: 200,
  },
  {
    name: "Địa chỉ",
    prop: "address",
    align: "text-left",
    width: 180,
  },
  {
    name: "Điện thoại",
    prop: "phoneNumber",
    align: "text-left",
    width: 180,
  },
];

async function fetchNewEmployee(skip, take, keySearch, reload) {
  console.log(keySearch);
  const response = await $axios.get($api.customer.filter, {
    params: {
      skip: skip,
      take: take,
      keySearch: keySearch,
    },
  });
  if (reload) entityList.value = [];
  for (const entity of response.data.filteredList) {
    entityList.value.push(entity);
  }
  console.log(response);
}

async function tableContentOnScroll(e) {
  let {
    target: { scrollTop, clientHeight, scrollHeight },
  } = e;
  if (scrollTop + clientHeight >= scrollHeight) {
    await fetchNewEmployee(
      entityList.value.length,
      10,
      props.selectedEmployeeName,
      false
    );
  }
}

async function btnDropDownOnClick() {
  if (!isTableOpen.value && entityList.value.length == 0) {
    await fetchNewEmployee(
      entityList.value.length,
      10,
      props.selectedEmployeeName,
      false
    );
  }
  isTableOpen.value = !isTableOpen.value;
  if (isTableOpen.value && props.selectedEmployeeId != "") {
    await nextTick();
    talbeContentRef.value.scrollTo({
      top: 38 * selectedEmployeeIndex.value,
      behavior: "smooth",
    });
  }
}

function inputKeyupHandler($event) {
  if (!isNormalCharacterKey($event.key)) return;

  // 500ms sau khi Typing tự động mở optionBox
  if (isTableOpen.value == false && $event.key != "Tab") {
    setTimeout(() => {
      isTableOpen.value = true;
    }, 500);
  }
  // Xóa các timeout trước trong khi typing
  while (typingTimers.length > 0) {
    clearTimeout(typingTimers[0]);
    typingTimers.splice(0, 1);
  }

  typingTimers.push(
    setTimeout(() => {
      // Display loading
      isLoadingData.value = true;
      emits("update:selectedEmployeeId", "");
      fetchNewEmployee(0, 20, props.selectedEmployeeName, true);
      isLoadingData.value = false;
    }, timeoutVal)
  );
}

/**
 * Sự kiện Typing vào ô input
 * Author: Dũng (08/05/2023)
 */
function inputKeyPressHandler($event) {
  if (!isNormalCharacterKey($event.key)) return;
  isLoadingData.value = true;
  // Xóa setTimeout đã tạo từ tước
  while (typingTimers.length > 0) {
    clearTimeout(typingTimers[0]);
    typingTimers.splice(0, 1);
  }
}

//#region function
/**
 * Kiểm tra keypress có là ký tự text bình thường không
 * @param {String} key là $event.key
 *
 * Author: Dũng(12/05/2023)
 */
function isNormalCharacterKey(key) {
  return key.length == 1 || key == "Backspace" ? true : false;
}

function trOnClick(index) {
  emits(
    "update:selectedValueOne",
    entityList.value[index][entityStructure.code]
  );
  emits("update:selectedEntityId", entityList.value[index][entityStructure.id]);
  selectedEmployeeIndex.value = index;
  isTableOpen.value = false;
}
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/cash/receipt/customer-combobox.css"
></style>