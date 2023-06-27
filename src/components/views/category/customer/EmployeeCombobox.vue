<template>
  <div class="ecb">
    <div class="ecb__label">Nhân viên bán hàng</div>
    <div class="ecb__main" :class="[isTableOpen ? 'active' : '']">
      <div class="main__selected">
        <div class="selected__input">
          <input
            type="text"
            ref="refInput"
            v-model="inputText"
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
    <div class="ecb__table" v-show="isTableOpen">
      <div class="table__header">
        <table class="t__header">
          <thead>
            <tr>
              <th>
                <div class="th__text align--left w-150">Mã nhân viên</div>
              </th>
              <th>
                <div class="th__text align--left w-200">Tên nhân viên</div>
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
              v-for="(employee, index) in employeeList"
              :key="employee.employeeId"
              @click="trOnClick(index)"
              :class="[
                employee.employeeId == selectedEmployeeId ? 'selected' : '',
              ]"
            >
              <td class="w-180">
                <div class="td__text align--left">
                  {{ employee.employeeCode }}
                </div>
              </td>
              <td>
                <div class="right__container">
                  <div class="td__text align--left w-180">
                    {{ employee.employeeFullName }}
                  </div>
                </div>
              </td>
            </tr>
            <tr v-show="employeeList.length == 0">
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
const employeeList = ref([]);
const typingTimers = [];
const timeoutVal = 500;
const inputText = ref("");
const isLoadingData = ref(false);
const talbeContentRef = ref(null);
const selectedEmployeeIndex = ref(0);

const props = defineProps({
  selectedEmployeeId: String,
});
const emits = defineEmits(["update:selectedEmployeeId"]);

async function fetchNewEmployee(skip, take, keySearch, reload) {
  console.log(keySearch);
  const response = await $axios.get($api.employee.filter, {
    params: {
      skip: skip,
      take: take,
      keySearch: keySearch,
    },
  });
  if (reload) employeeList.value = [];
  for (const emp of response.data.filteredList) {
    employeeList.value.push({
      employeeId: emp.employeeId,
      employeeCode: emp.employeeCode,
      employeeFullName: emp.employeeFullName,
    });
  }
  console.log(response);
}

async function tableContentOnScroll(e) {
  let {
    target: { scrollTop, clientHeight, scrollHeight },
  } = e;
  if (scrollTop + clientHeight >= scrollHeight) {
    await fetchNewEmployee(
      employeeList.value.length,
      10,
      inputText.value,
      false
    );
  }
}

async function btnDropDownOnClick() {
  if (!isTableOpen.value && employeeList.value.length == 0) {
    await fetchNewEmployee(
      employeeList.value.length,
      10,
      inputText.value,
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
      fetchNewEmployee(0, 20, inputText.value, true);
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
  inputText.value = employeeList.value[index].employeeFullName;
  emits("update:selectedEmployeeId", employeeList.value[index].employeeId);
  selectedEmployeeIndex.value = index;
  isTableOpen.value = false;
}
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/category/customer/employee-combobox.css"
></style>
