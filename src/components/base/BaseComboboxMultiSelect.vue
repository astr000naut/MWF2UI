<template>
  <div class="cbms">
    <div class="cbms__label">Nhóm khách hàng</div>
    <div class="cbms__main" :class="[isTableOpen ? 'active' : '']">
      <div class="main__selected">
        <div
          class="selected__item__container"
          v-for="code in selectedElementCode"
          :key="code"
        >
          <div class="selected__item">
            <div class="item__code">{{ code }}</div>
            <div
              class="item__close mi mi-16 mi-close-small"
              @click="itemCloseOnClick(code)"
            ></div>
          </div>
        </div>
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
    <div class="cbms__table" v-show="isTableOpen">
      <div class="table__header">
        <table class="t__header">
          <thead>
            <tr>
              <th>
                <div class="th__text align--left w-150">Mã nhóm KH, NCC</div>
              </th>
              <th>
                <div class="th__text align--left w-200">Tên nhóm KH, NCC</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="t__loader" v-show="isLoadingData">
        <BaseLoader />
      </div>
      <div class="table__content" v-show="!isLoadingData">
        <table class="t__content">
          <tbody>
            <tr
              v-for="element in dataListStandardized"
              :key="element.groupCode"
              @click="trOnclick(element.groupCode)"
              :class="[
                selectedElementCode.includes(element.groupCode)
                  ? 'selected'
                  : '',
              ]"
            >
              <td
                :style="{
                  paddingLeft: 10 * (element.grade % 9) + 'px',
                }"
                class="w-180"
              >
                <div
                  class="td__text align--left"
                  :class="[element.isParent ? 'text--bold' : '']"
                >
                  {{ element.groupCode }}
                </div>
              </td>
              <td>
                <div class="right__container">
                  <div class="td__text align--left w-180">
                    {{ element.groupName }}
                  </div>
                  <div class="td__check"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-show="dataListStandardized.length == 0">
          <div class="no__data">Không có dữ liệu</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
const refInput = ref(null);
const isTableOpen = ref(false);
const $axios = inject("$axios");
import $api from "../../js/api";
import BaseLoader from "./BaseLoader.vue";
const dataList = ref([]);
const inputText = ref("");
const isLoadingData = ref(false);
// dataListStandardized = [
//   {
//     code: "11111",
//     name: "Nhom 1",
//     level: 0,
//     isLeaf: false,
//   },
// ]
const dataListStandardized = ref([]);
const selectedElementCode = ref([]);
const typingTimers = [];
const timeoutVal = 500;

const emits = defineEmits("update:selectedElementCode");

function standardizeDataList() {
  let maxGrade = 0;
  for (let i = 0; i < dataList.value.length; ++i) {
    if (dataList.value[i].grade > maxGrade) maxGrade = dataList.value[i].grade;
  }
  dataListStandardized.value = [];

  let index = 0;
  let inserted = false;
  console.log(maxGrade);
  for (let g = 0; g <= maxGrade; ++g) {
    for (let i = 0; i < dataList.value.length; ++i) {
      if (dataList.value[i].grade == g) {
        index = 0;
        inserted = false;
        while (index < dataListStandardized.value.length && !inserted) {
          if (
            dataListStandardized.value[index].groupId ==
            dataList.value[i].parentId
          ) {
            dataListStandardized.value.splice(index + 1, 0, dataList.value[i]);
            inserted = true;
            ++index;
          }
          ++index;
        }
        if (!inserted) dataListStandardized.value.push(dataList.value[i]);
      }
    }
  }
  console.log("Final");
  console.log(dataListStandardized.value);
}

async function trOnclick(elementCode) {
  if (!selectedElementCode.value.includes(elementCode)) {
    selectedElementCode.value.push(elementCode);
  } else {
    const index = selectedElementCode.value.indexOf(elementCode);
    if (index > -1) {
      selectedElementCode.value.splice(index, 1);
    }
  }
  if (inputText.value != "") {
    inputText.value = "";
    await fetchNewData(0, null, inputText.value, true);
  }
  refInput.value.focus();
}

function itemCloseOnClick(elementCode) {
  const index = selectedElementCode.value.indexOf(elementCode);
  if (index > -1) {
    selectedElementCode.value.splice(index, 1);
  }
}

async function fetchNewData(skip, take, keySearch, reload) {
  console.log(keySearch);
  const response = await $axios.get($api.group.filter, {
    params: {
      skip: skip,
      take: take,
      keySearch: keySearch,
    },
  });
  if (reload) dataList.value = [];
  for (const group of response.data.filteredList) {
    dataList.value.push(group);
  }
  console.log(dataList.value);
  standardizeDataList();
}

async function btnDropDownOnClick() {
  if (!isTableOpen.value && dataList.value.length == 0) {
    await fetchNewData(0, null, inputText.value, false);
  }
  isTableOpen.value = !isTableOpen.value;
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
      emits("update:selectedElementCode", selectedElementCode);
      fetchNewData(0, null, inputText.value, true);
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

/**
 * Kiểm tra keypress có là ký tự text bình thường không
 * @param {String} key là $event.key
 *
 * Author: Dũng(12/05/2023)
 */
function isNormalCharacterKey(key) {
  return key.length == 1 || key == "Backspace" ? true : false;
}
</script>

<style
  scoped
  lang="css"
  src="../../css/components/base/base-combobox-multiselect.css"
></style>
