<template>
  <div class="tablebox">
    <table class="m-table">
      <thead>
        <tr>
          <th v-for="header in tableStructure.headerList" :key="header.name">
            <div :class="header.align" :style="{ width: header.width + 'px' }">
              {{ header.name }}
            </div>
          </th>
          <th class="thn--sticky">
            <div class="align-center mw-90">{{ lang.tableHeader.tool }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="isLoadingData">
          <tr v-for="i in Math.min(12, pagingData.pageSize)" :key="i">
            <td class="td1--sticky"><div class="loading-item"></div></td>
            <td v-for="j in 5" :key="j">
              <div class="loading-item"></div>
            </td>
            <td class="tdn--sticky">
              <div class="loading-item"></div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="{
              active,
              acc,
              isExpand,
              isTemporary,
            } = row in rowListDisplay"
            :key="acc.accountId"
            :class="{
              active: active,
              'text--bold': acc.isParent,
            }"
            @click="trOnClick(acc.accountId)"
            @dblclick="trOnDblclick(acc.accountId)"
          >
            <td>
              <div
                class="text-left account__number"
                :style="{
                  paddingLeft:
                    24 * (acc.grade % 9) +
                    (!acc.isParent && acc.parentId == '' ? 24 : 0) +
                    (acc.parentId != '' && isTemporary ? 24 : 0) +
                    'px',
                }"
              >
                <div
                  class="an__expand mi mi-16"
                  :class="[
                    !isExpand
                      ? 'mi-tree-expand--small'
                      : 'mi-tree-collapse--small',
                  ]"
                  v-show="acc.isParent"
                  @click="accNumberExpandOnClick(acc.accountId)"
                  @dblclick.stop
                ></div>
                <div class="an__text" v-tooltip="acc['accountNumber']">
                  {{ acc["accountNumber"] }}
                </div>
              </div>
            </td>
            <td>
              <div class="text-left" v-tooltip="acc.accountNameVi">
                {{ acc.accountNameVi }}
              </div>
            </td>
            <td>
              <div class="text-left" v-tooltip="acc.categoryKindName">
                {{ acc.categoryKindName }}
              </div>
            </td>
            <td>
              <div class="text-left" v-tooltip="acc.accountNameEn">
                {{ acc.accountNameEn }}
              </div>
            </td>
            <td>
              <div class="text-left" v-tooltip="acc.description">
                {{ acc.description }}
              </div>
            </td>
            <td>
              <div class="text-left" v-tooltip="'Đang sử dụng'">
                Đang sử dụng
              </div>
            </td>
            <td
              :class="[table.expandAccId == acc.accountId ? 'above' : '']"
              class="tdn--sticky"
              @dblclick.stop
            >
              <div class="t__optionbox align-center">
                <button
                  class="option__edit"
                  @click="btnEditOnClick(acc.accountId)"
                >
                  {{ lang.table_items.edit }}
                </button>
                <button
                  class="btn__expand mi mi-16 mi-expand-down"
                  @click="btnExpandOnClick(acc.accountId)"
                ></button>
                <ul
                  class="actions-list btn__expand"
                  :class="
                    (acc.accountId ==
                      rowListDisplay[rowListDisplay.length - 1].acc.accountId ||
                      acc.accountId ==
                        rowListDisplay[rowListDisplay.length - 2].acc
                          .accountId) &&
                    rowListDisplay.length > 6
                      ? 'action-list--top'
                      : ''
                  "
                  v-show="table.expandAccId == acc.accountId"
                  @mouseleave="table.expandAccId = ''"
                >
                  <li>
                    <div class="li-data">
                      {{ lang.table_items.dupplicate }}
                    </div>
                  </li>
                  <li>
                    <div class="li-data" @click="deleteFunction(acc.accountId)">
                      {{ lang.table_items.delete }}
                    </div>
                  </li>
                  <li>
                    <div class="li-data">{{ lang.table_items.stop }}</div>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div
      class="table__notification"
      v-show="!haveDataAfterCallApi && !isLoadingData"
    >
      <div class="noti__img"></div>
      <div class="noti__text">{{ lang.tableNoti.dataNotFound }}</div>
    </div>
  </div>
  <div class="table__pag">
    <div class="pag__leftside">
      <span
        >{{ lang.tablePag.total.left }}
        <strong>{{ pagingData.totalRecord }}</strong>
        {{ lang.tablePag.total.right }}</span
      >
    </div>
    <div class="pag__rightside">
      <!-- <div class="pag__recordcount">
        <div class="record__amount__select" v-show="table.recordAmountOpen">
          <ul>
            <li
              v-for="recordAmount in table.recordAmountList"
              :key="recordAmount"
            >
              <div
                class="record__amount__option"
                :class="[
                  recordAmount == pagingData.pageSize ? 'amount--selected' : '',
                ]"
                @click="recordAmountOptionOnClick(recordAmount)"
              >
                {{ recordAmount }} {{ lang.tablePag.recordAmount }}
              </div>
            </li>
          </ul>
        </div>
        <span>{{ lang.tablePag.recordPerPage }} {{ pagingData.pageSize }}</span>
        <div
          class="pag__arrowdown mi mi-24 mi-arrowdown-small"
          :class="[
            table.recordAmountOpen ? 'mi-arrowup-small' : 'mi-arrowdown-small',
          ]"
          @click="pagArrowdownOnClick"
        ></div>
      </div> -->
      <div class="pag__info">
        <div class="info__left">
          {{
            pagingData.pageSize * (pagingData.pageNumber - 1) +
            (rowListDisplay.length > 0 ? 1 : 0)
          }}
        </div>
        <div class="info__minus">-</div>
        <div class="info__right">
          <div class="right__number" v-show="!isLoadingData">
            <strong>{{
              pagingData.pageSize * (pagingData.pageNumber - 1) +
              pagingData.curAmount
            }}</strong>
          </div>
          <div class="right__loading" v-show="isLoadingData">
            <div class="loading-item"></div>
          </div>
        </div>
        <div class="info__text">{{ lang.tablePag.record }}</div>
      </div>
      <!-- <div
        class="pag__prev minc mi-24 mi-arrowleft"
        :class="[
          !isLoadingData && pagingData.pageNumber <= 1 ? 'disabled' : '',
        ]"
        @click="prevPageOnClick"
      ></div>
      <div
        class="pag__next minc mi-24 mi-arrowright"
        :class="[!isLoadingData && isLastPage ? 'disabled' : '']"
        @click="nextPageOnClick"
      ></div> -->
    </div>
  </div>
</template>

<script setup>
// #region import
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
const lang = inject("$lang");
// #endregion

// #region init
const tableStructure = {
  allowMultipeOperation: true,
  headerList: [
    {
      name: "SỐ TÀI KHOẢN",
      align: "text-left",
      width: 200,
    },
    {
      name: "TÊN TÀI KHOẢN",
      align: "text-left",
      width: 220,
    },
    {
      name: "TÍNH CHẤT",
      align: "text-left",
      width: 150,
    },
    {
      name: "TÊN TIẾNG ANH",
      align: "text-left",
      width: 220,
    },
    {
      name: "DIỄN GIẢI",
      align: "text-left",
      width: 220,
    },
    {
      name: "TRẠNG THÁI",
      align: "text-left",
      width: 150,
    },
  ],
};
const router = useRouter();

const props = defineProps({
  pagingData: Object,
  isLoadingData: Boolean,
  rowList: Array,
  deleteFunction: Function,
  pagingNextPage: Function,
  pagingPrevPage: Function,
  haveDataAfterCallApi: Boolean,
});

const emits = defineEmits(["updatePagingData", "updateRowStatus"]);

const table = ref({
  recordAmountOpen: false,
  recordAmountList: [10, 20, 30, 50, 100],
  expandAccId: "",
});

// #endregion

// #region computed
/**
 * Kiểm tra xem trang hiện tại có phải là trang cuối không
 * Author: Dũng (28/05/2023)
 */
// const isLastPage = computed(() => {
//   return (
//     (props.pagingData.pageNumber - 1) * props.pagingData.pageSize +
//       props.pagingData.curAmount >=
//     props.pagingData.totalRecord
//   );
// });

const rowListDisplay = computed(() => {
  return props.rowList.filter((row) => row.display);
});
// #endregion

// #region handle event

/**
 * Click next chuyển trang
 * Author: Dũng (08/05/2023)
 */
// async function nextPageOnClick() {
//   if (isLastPage.value || props.isLoadingData) return;
//   //await props.pagingNextPage();
// }

/**
 * Click prev chuyển trang
 * Author: Dũng (08/05/2023)
 */
// async function prevPageOnClick() {
//   if (props.pagingData.pageNumber <= 1 || props.isLoadingData) return;
//   //await props.pagingPrevPage();
//   console.log("Prev");
// }

function accNumberExpandOnClick(accountId) {
  emits("updateRowStatus", {
    type: "ExpandCollapse",
    itemId: accountId,
  });
}

function btnEditOnClick(accId) {
  router.push(`/DI/DIAccount/${accId}`);
}

/**
 * Click vào nút mở rộng của một nhân viên
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function btnExpandOnClick(empId) {
  if (table.value.expandAccId == empId) {
    table.value.expandAccId = "";
  } else {
    table.value.expandAccId = empId;
  }
}

/**
 * Click chọn số lượng bản ghi/trang
 * @param {Number} recordAmount số lượng bản ghi/trang
 * Author: Dũng (08/05/2023)
 */
// function recordAmountOptionOnClick(recordAmount) {
//   emits("updatePagingData", {
//     totalRecord: props.pagingData.totalRecord,
//     curAmount: props.pagingData.curAmount,
//     pageSize: recordAmount,
//     pageNumber: 1,
//   });
//   table.value.recordAmountOpen = false;
// }

/**
 * Click mở menu chọn số lượng bản ghi/trang
 * Author: Dũng (08/05/2023)
 */
// function pagArrowdownOnClick() {
//   table.value.recordAmountOpen = !table.value.recordAmountOpen;
// }

/**
 * Click vào tr
 * @param {String} rowIndex index của dòng
 * Author: Dũng (08/05/2023)
 */
function trOnClick(accountId) {
  emits("updateRowStatus", {
    type: "active",
    itemId: accountId,
  });
}

/**
 * DblClick vào checkbox
 * @param {String} accId Id account
 * Author: Dũng (08/05/2023)
 */
function trOnDblclick(accId) {
  router.push(`/DI/DIAccount/${accId}`);
}

// #endregion
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/category/account/account-table.css"
></style>
