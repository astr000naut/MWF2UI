<template>
  <div class="tablebox">
    <table class="m-table">
      <thead>
        <tr>
          <th>
            <div class="text-left w-120">Số tài khoản</div>
          </th>
          <th>
            <div class="text-left w-200">Tên tài khoản</div>
          </th>
          <th>
            <div class="text-left w-250">Tính chất</div>
          </th>
          <th>
            <div class="text-left w-120">Tên tiếng Anh</div>
          </th>
          <th>
            <div class="text-left w-120">Diễn giải</div>
          </th>
          <th>
            <div class="text-left w-120">Trạng thái</div>
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
            v-for="({ active, cus } = row, index) in rowList"
            :key="cus.customerId"
            :class="{
              active: active,
            }"
            @click="trOnClick(index)"
            @dblclick="trOnDblclick(cus.customerId)"
          >
            <td>
              <div class="text-left">{{ cus.customerCode }}</div>
            </td>
            <td>
              <div class="text-left">{{ cus.customerFullName }}</div>
            </td>
            <td>
              <div class="text-left">{{ cus.address }}</div>
            </td>
            <td>
              <div class="text-left">{{ cus.phoneNumber }}</div>
            </td>
            <td>
              <div class="text-left">{{ cus.identityNumber }}</div>
            </td>
            <td>
              <div class="text-left">Đang sử dụng</div>
            </td>
            <td
              :class="[table.expandEmpId == cus.customerId ? 'above' : '']"
              class="tdn--sticky"
              @dblclick.stop
            >
              <div class="t__optionbox align-center">
                <button
                  class="option__edit"
                  @click="btnEditOnClick(cus.customerId)"
                >
                  {{ lang.table_items.edit }}
                </button>
                <button
                  class="btn__expand mi mi-16 mi-expand-down"
                  @click="btnExpandOnClick(cus.customerId)"
                ></button>
                <ul
                  class="actions-list btn__expand"
                  :class="
                    (cus.customerId ==
                      rowList[rowList.length - 1].cus.customerId ||
                      cus.customerId ==
                        rowList[rowList.length - 2].cus.customerId) &&
                    rowList.length > 6
                      ? 'action-list--top'
                      : ''
                  "
                  v-show="table.expandEmpId == cus.customerId"
                  @mouseleave="table.expandEmpId = ''"
                >
                  <li>
                    <div
                      class="li-data"
                      @click="dupplicateEmployeeOnClick(emp)"
                    >
                      {{ lang.table_items.dupplicate }}
                    </div>
                  </li>
                  <li>
                    <div
                      class="li-data"
                      @click="deleteCustomerFunction(cus.customerId)"
                    >
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
      <div class="pag__recordcount">
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
      </div>
      <div class="pag__info">
        <div class="info__left">
          {{
            pagingData.pageSize * (pagingData.pageNumber - 1) +
            (rowList.length > 0 ? 1 : 0)
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
      <div
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
      ></div>
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
const router = useRouter();

const props = defineProps({
  pagingData: Object,
  isLoadingData: Boolean,
  rowList: Array,
  deleteCustomerFunction: Function,
  pagingNextPage: Function,
  pagingPrevPage: Function,
  haveDataAfterCallApi: Boolean,
});

const emits = defineEmits([
  "updatePagingData",
  "updateRowStatus",
  "updateDupplicateEmp",
]);

const table = ref({
  recordAmountOpen: false,
  recordAmountList: [10, 20, 30, 50, 100],
  expandEmpId: "",
});

// #endregion

// #region computed
/**
 * Kiểm tra xem trang hiện tại có phải là trang cuối không
 * Author: Dũng (28/05/2023)
 */
const isLastPage = computed(() => {
  return (
    (props.pagingData.pageNumber - 1) * props.pagingData.pageSize +
      props.pagingData.curAmount >=
    props.pagingData.totalRecord
  );
});
// #endregion

// #region handle event
/**
 * Sự kiện click vào nhân bản
 * Author: Dũng (03/06/2023)
 */
function dupplicateEmployeeOnClick(emp) {
  emits("updateDupplicateEmp", emp);
  // router.push(`/employee/dupplicate/${empId}`);
}

/**
 * Click next chuyển trang
 * Author: Dũng (08/05/2023)
 */
async function nextPageOnClick() {
  if (isLastPage.value || props.isLoadingData) return;
  await props.pagingNextPage();
}

/**
 * Click prev chuyển trang
 * Author: Dũng (08/05/2023)
 */
async function prevPageOnClick() {
  if (props.pagingData.pageNumber <= 1 || props.isLoadingData) return;
  await props.pagingPrevPage();
  console.log("Prev");
}

/**
 * Click vào btn sửa nhân viên
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function btnEditOnClick(empId) {
  router.push(`/DI/DIEmployee/${empId}`);
}

/**
 * Click vào nút mở rộng của một nhân viên
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function btnExpandOnClick(empId) {
  if (table.value.expandEmpId == empId) {
    table.value.expandEmpId = "";
  } else {
    table.value.expandEmpId = empId;
  }
}

/**
 * Click chọn số lượng bản ghi/trang
 * @param {Number} recordAmount số lượng bản ghi/trang
 * Author: Dũng (08/05/2023)
 */
function recordAmountOptionOnClick(recordAmount) {
  emits("updatePagingData", {
    totalRecord: props.pagingData.totalRecord,
    curAmount: props.pagingData.curAmount,
    pageSize: recordAmount,
    pageNumber: 1,
  });
  table.value.recordAmountOpen = false;
}

/**
 * Click mở menu chọn số lượng bản ghi/trang
 * Author: Dũng (08/05/2023)
 */
function pagArrowdownOnClick() {
  table.value.recordAmountOpen = !table.value.recordAmountOpen;
}

/**
 * Click vào tr
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function trOnClick(rowIndex) {
  emits("updateRowStatus", {
    type: "active",
    rowIndex: rowIndex,
  });
}

/**
 * DblClick vào checkbox
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function trOnDblclick(cusId) {
  console.log(cusId);
  router.push(`/DI/DICustomer/${cusId}`);
}

// #endregion
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/category/account/account-table.css"
></style>
