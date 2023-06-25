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
          <input type="text" ref="refInput" />
        </div>
      </div>
      <div class="main__action">
        <div class="btn__add">
          <div class="btn__add__icon mi mi-12 mi-add--green"></div>
        </div>
        <button class="btn__dropdown" @click="isTableOpen = !isTableOpen">
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
      <div class="table__content">
        <table class="t__content">
          <tbody>
            <tr
              v-for="element in dataListNormalized"
              :key="element.code"
              @click="trOnclick(element.code)"
              :class="[
                selectedElementCode.includes(element.code) ? 'selected' : '',
              ]"
            >
              <td
                :style="{
                  paddingLeft: 10 * (element.level % 9) + 'px',
                }"
                class="w-180"
              >
                <div
                  class="td__text align--left"
                  :class="[element.isLeaf ? '' : 'text--bold']"
                >
                  {{ element.code }}
                </div>
              </td>
              <td>
                <div class="right__container">
                  <div class="td__text align--left w-180">
                    {{ element.name }}
                  </div>
                  <div class="td__check"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const refInput = ref(null);
const isTableOpen = ref(false);
const dataList = ref([
  {
    code: "11111",
    name: "Nhom 1",
    childs: [
      {
        code: "111112",
        name: "Nhom 1 1",
        childs: [
          {
            code: "asd",
            name: "asdas",
            childs: [],
          },
          {
            code: "abc",
            name: "asdasdasd",
            childs: [
              {
                code: "abcd",
                name: "asdasdasd",
                childs: [
                  {
                    code: "abcdd",
                    name: "asdasdasd",
                    childs: [
                      {
                        code: "abf",
                        name: "asdasdasd",
                        childs: [
                          {
                            code: "abde",
                            name: "000",
                            childs: [
                              {
                                code: "con 1",
                                name: "1111",
                                childs: [
                                  {
                                    code: "con 2",
                                    name: "2222",
                                    childs: [
                                      {
                                        code: "con 3",
                                        name: "3333",
                                        childs: [
                                          {
                                            code: "con 4",
                                            name: "4444",
                                            childs: [],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: "code so 88",
        name: "Nhom 1 2",
        childs: [
          {
            code: "code so 89",
            name: "Nhom 1 1",
            childs: [
              {
                code: "code so 90",
                name: "asdas",
                childs: [],
              },
              {
                code: "code so 92",
                name: "asdasdasd",
                childs: [
                  {
                    code: "code so 91",
                    name: "asdasdasd",
                    childs: [
                      {
                        code: "code so 93",
                        name: "asdasdasd",
                        childs: [
                          {
                            code: "code so 94",
                            name: "asdasdasd",
                            childs: [
                              {
                                code: "code so 995",
                                name: "000",
                                childs: [
                                  {
                                    code: "code so 96",
                                    name: "1111",
                                    childs: [
                                      {
                                        code: "code so 97",
                                        name: "2222",
                                        childs: [
                                          {
                                            code: "code so 98",
                                            name: "3333",
                                            childs: [
                                              {
                                                code: "code so 99",
                                                name: "4444",
                                                childs: [],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "1123",
    name: "Nhom 2",
    childs: [],
  },
]);
// dataListNormalized = [
//   {
//     code: "11111",
//     name: "Nhom 1",
//     level: 0,
//     isLeaf: false,
//   },
// ]
const dataListNormalized = ref([]);
const selectedElementCode = ref([]);

function explore(element, level) {
  dataListNormalized.value.push({
    code: element.code,
    name: element.name,
    level: level,
    isLeaf: element.childs.length == 0,
  });
  if (element.childs.length != 0) {
    for (let i = 0; i < element.childs.length; ++i) {
      explore(element.childs[i], level + 1);
    }
  }
}

for (let i = 0; i < dataList.value.length; ++i) {
  explore(dataList.value[i], 0);
}

watch(dataList, (newDataList) => {
  for (let i = 0; i < newDataList.value.length; ++i) {
    explore(newDataList.value[i], 0);
  }
});

watch(
  selectedElementCode,
  () => {
    if (isTableOpen.value) refInput.value.focus();
  },
  { deep: true }
);

function trOnclick(elementCode) {
  if (!selectedElementCode.value.includes(elementCode)) {
    selectedElementCode.value.push(elementCode);
  } else {
    const index = selectedElementCode.value.indexOf(elementCode);
    if (index > -1) {
      selectedElementCode.value.splice(index, 1);
    }
  }
}

function itemCloseOnClick(elementCode) {
  const index = selectedElementCode.value.indexOf(elementCode);
  if (index > -1) {
    selectedElementCode.value.splice(index, 1);
  }
}
</script>

<style
  scoped
  lang="css"
  src="../../css/components/base/base-combobox-multiselect.css"
></style>
