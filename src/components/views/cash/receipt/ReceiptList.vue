<template>
  <div class="page__wrapper" v-show="isLoadingPage">
    <BaseLoader />
  </div>
  <div class="page__wrapper" v-show="dialog.isDisplay">
    <BaseDialog
      :title="lang.cat_customer.dialog.deleteConfirmation"
      :message="dialog.message"
      :close-on-click="dialogCloseOnClick"
      :no-on-click="dialogCloseOnClick"
      :yes-on-click="dialog.action"
    />
  </div>
  <BaseToastbox
    class="toastbox__position"
    :toast-list="toastList"
    :remove-toast="removeToast"
  />
  <router-view
    name="ReceiptForm"
    v-model:metadata="formMetadata"
    @update-cuslist="customerOnUpdate"
  ></router-view>
  <div class="pcontent">
    <div class="pcontent__overview">
      <div class="overview__container">
        <div class="o_item item--total-receive">
          <div class="o_item__left">Tổng thu đầu năm đến hiện tại</div>
          <div class="o_item__right">456.617.444</div>
        </div>
        <div class="o_item item--total-paid">
          <div class="o_item__left">Tổng chi đầu năm đến hiện tại</div>
          <div class="o_item__right">200.456.546</div>
        </div>
        <div class="o_item item--total-left">
          <div class="o_item__left">Tổng quỹ hiện tại</div>
          <div class="o_item__right">600.617.444</div>
        </div>
      </div>
    </div>
    <div class="pcontent__container">
      <div class="pcontent__searchbar">
        <div class="searchbar__right">
          <div class="filter">
            <div class="filter__btn">
              <div class="btn__text">Lọc</div>
              <div class="btn__icon mi mi-16 mi-arrowup--black"></div>
            </div>
            <div class="filter__panel">
              <div class="panel__top"></div>
              <div class="panel__mid"></div>
              <div class="panel__bot"></div>
            </div>
          </div>
          <BaseTextfield
            pholder="Tìm kiếm"
            :hideLabel="true"
            class="txtfield--search mw-300"
            noti=""
            v-model:text="cache.cusSearchPattern"
            :realTimeSearch="true"
            :doSearch="doSearchReceipt"
          />
          <BaseButton class="mi mi-36 mi-refresh" @click="loadCustomerData" />
          <div class="button__hoverbox--refresh">
            <div class="hover__arrow"></div>
            <div class="hover__text">{{ lang.button.reload }}</div>
          </div>
          <div
            :class="[isLoadingExport ? 'disabled' : '']"
            class="minc mi-36 mi-excel"
          ></div>
          <div class="button__hoverbox--export">
            <div class="hover__arrow"></div>
            <div class="hover__text">{{ lang.button.export }}</div>
          </div>
          <div class="export__loader" v-show="isLoadingExport">
            <BaseLoader></BaseLoader>
          </div>
          <div class="btn__add-receipt">
            <div class="add__text" @click="btnAddOnClick">Thu tiền</div>
            <div class="add__select">
              <div class="select__icon mi mi-16 mi-arrow-up--white"></div>
            </div>
          </div>
        </div>
        <div class="searchbar__left" v-show="selectedCusIds.length > 1">
          <div class="left__info">
            Đã chọn: <strong>{{ selectedCusIds.length }}</strong>
          </div>
          <div class="left__cancel" @click="cancelSelectOnClick">
            {{ lang.button.cancelSelect }}
          </div>
          <BaseButton
            bname="Xóa hàng loạt"
            class="btn--secondary"
            @click="showBatchDeleteConfirmDialog"
          />
        </div>
      </div>
      <ReceiptTable
        :is-loading-data="isLoadingData"
        :row-list="rowList"
        :key="tableKey"
        :delete-customer-function="deleteCustomerOnClick"
        :selected-cus-ids="selectedCusIds"
        :selected-amount-in-page="selectedAmountInPage"
        :have-data-after-call-api="haveDataAfterCallApi"
        v-model:pagingData="pagingData"
        :paging-next-page="pagingNextPage"
        :paging-prev-page="pagingPrevPage"
        @update-paging-data="pagingDataOnUpdate"
        @update-row-status="rowStatusOnUpdate"
        @update-dupplicate-cus="dupplicateCusOnUpdate"
      />
    </div>
  </div>
</template>

<script setup>
// #region import
import ReceiptTable from "./ReceiptTable.vue";
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { useRouter } from "vue-router";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseToastbox from "@/components/base/BaseToastbox.vue";
import $api from "@/js/api";
import { Customer } from "@/js/model/customer";
import $error from "../../../../js/resources/error";
import $message from "../../../../js/resources/message";
const lang = inject("$lang");
// #endregion

// #region init
const router = useRouter();
const $emitter = inject("$emitter");
const rowList = ref([]);
const isLoadingData = ref(false);
const isLoadingPage = ref(false);
const isLoadingExport = ref(false);
const $axios = inject("$axios");
const tableKey = ref(0);
const haveDataAfterCallApi = ref(true);
const pagingData = ref({
  totalRecord: 0,
  curAmount: 0,
  pageSize: 20,
  pageNumber: 1,
});
const dialog = ref({
  isDisplay: false,
  message: "",
  action: null,
});
const cache = ref({
  cusDeleteId: "",
  cusDeleteIndex: "",
  cusSearchPattern: "",
});
const selectedCusIds = ref([]);
const selectedAmountInPage = ref(0);
const toastList = ref([]);
var toastId = 0;
const formMetadata = ref({
  isDupplicate: false,
  customerDupplicate: null,
});
// #endregion

// #region hook
onMounted(async () => {
  // Gọi API lấy danh sách nhân viên
  await loadCustomerData();
  // Lắng nghe sự kiện sau khi thay đổi kích cỡ sidebar thì vẽ lại table
  $emitter.on("rerenderTable", () => {
    tableKey.value += 1;
    if (tableKey.value > 100) {
      tableKey.value = 0;
    }
  });
});

onBeforeUnmount(() => {
  $emitter.off("rerenderTable");
});
// #endregion

// #region function
/**
 * Tìm kiếm nhân viên khi nhập vào ô tìm kiếm
 * Author: Dũng (26/05/2023)
 */
async function doSearchReceipt() {
  pagingData.value.pageNumber = 1;
  await loadCustomerData();
}
/**
 * Tạo toast message mới và đẩy vào toastList
 * @param {Object} toast object thông báo
 *
 * Author: Dũng (10/05/2023)
 */
function pushToast(toast) {
  if (toastList.value.length > 5) toastList.value.splice(0, 1);
  toastList.value.push({
    id: toastId,
    type: toast.type,
    message: toast.message,
  });
  if (toast.timeToLive) {
    setToastTimeToLive(toastId, toast.timeToLive);
  }
  ++toastId;
  if (toastId > 99999) toastId = 0;
}

/**
 * Xóa một toast
 * @param {Number} id id của toast
 *
 * Author: Dũng (10/05/2023)
 */
function removeToast(id) {
  let i = 0;
  while (i < toastList.value.length) {
    if (toastList.value[i].id == id) {
      toastList.value.splice(i, 1);
      break;
    }
    ++i;
  }
}

/**
 * Set thời gian hiển thị của toast message
 * @param {Number} id id của toast
 * @param {Number} timeToLive thời gian hiển thị theo ms
 *
 * Author: Dũng (10/05/2023)
 */
function setToastTimeToLive(id, timeToLive) {
  setTimeout(() => {
    removeToast(id);
  }, timeToLive);
}

/**
 * Hiển thị cảnh báo xóa nhân viên
 * @param {String} cusCode mã nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
function showDeleteOneConfirmDialog(cusCode) {
  dialog.value.message = $message.customerDeleteConfirm(cusCode);
  dialog.value.action = async () => {
    dialog.value.isDisplay = false;
    await deleteCustomer();
  };
  dialog.value.isDisplay = true;
}

/**
 * Hiển thị cảnh báo xóa hàng loạt
 *
 * Author: Dũng (08/05/2023)
 */
function showBatchDeleteConfirmDialog() {
  dialog.value.message = $message.customerMultipleDeleteConfirm(
    selectedCusIds.value.length
  );
  dialog.value.isDisplay = true;
  dialog.value.action = async () => {
    dialog.value.isDisplay = false;
    await deleteBatchCustomer();
  };
}

/**
 * Quản lý lỗi trả về từ api
 * Author: Dũng (08/05/2023)
 */
function handleApiErrorResponse(error) {
  console.log(error);
  if (error.code == "ERR_NETWORK") {
    pushToast({
      type: "fail",
      message: $error.serverDisconnected,
    });
  } else {
    pushToast({
      type: "fail",
      message: error.response.data.UserMessage,
    });
  }
}

/**
 * Gọi API xóa KH
 * Author: Dũng (08/05/2023)
 */
async function deleteCustomer() {
  try {
    isLoadingPage.value = true;
    // Gọi API xóa KH theo ID
    await $axios.delete($api.customer.one(cache.value.cusDeleteId));
    // Xóa KH đó trên table
    rowList.value.splice(cache.value.cusDeleteIndex, 1);

    const index = selectedCusIds.value.indexOf(cache.value.cusDeleteId);
    if (index > -1) {
      // Nếu Customer đó đang được select thì xóa khỏi danh sách select
      selectedCusIds.value.splice(index, 1);
      selectedAmountInPage.value -= 1;
    }

    isLoadingPage.value = false;

    // Update pagingData
    // Cập nhật lại thông tin số bản ghi khách hàng
    pagingData.value.curAmount -= 1;
    pagingData.value.totalRecord -= 1;
    if (pagingData.value.curAmount == 0) {
      // Nếu trang hiện tại bị xóa hết thì load lại trang trước đó
      if (pagingData.value.pageNumber > 1) --pagingData.value.pageNumber;
      await loadCustomerData();
    }

    // Đẩy toast xóa thành công
    pushToast({
      type: "success",
      message: $message.customerDeleted,
      timeToLive: 1500,
    });
  } catch (error) {
    isLoadingPage.value = false;
    handleApiErrorResponse(error);
  }
}

/**
 * Gọi API xóa hàng loạt nhân viên
 * Author: Dũng (08/05/2023)
 */
async function deleteBatchCustomer() {
  try {
    // Số lượng KH đã bị xóa thành công
    let deletedSucess = 0;
    let idList = [];
    let batchAmount = 0;
    isLoadingPage.value = true;

    while (selectedCusIds.value.length) {
      // Số lượng KH bị xóa tối đa trong một lượt
      batchAmount = Math.min(20, selectedCusIds.value.length);
      idList = [];
      for (let i = 0; i < batchAmount; ++i)
        idList.push(selectedCusIds.value[i]);
      await $axios.post($api.customer.deleteMultiple, idList);
      deletedSucess += batchAmount;
      selectedCusIds.value.splice(0, batchAmount);
    }
    // Load lại dữ liệu cho table từ trang 1
    pagingData.value.pageNumber = 1;
    isLoadingPage.value = false;
    await loadCustomerData();

    pushToast({
      type: "success",
      message: $message.customerMultipeDeleted(deletedSucess),
      timeToLive: 1500,
    });
  } catch (error) {
    isLoadingPage.value = false;
    handleApiErrorResponse(error);
  }
}

// #endregion

// #region handle event

/**
 * Sự kiện Customer Table emit dupplicate lên Customer List
 * @param {Object} cus object customer được dupplicate
 *
 * Author: Dũng (2/07/2023)
 */
function dupplicateCusOnUpdate(cus) {
  formMetadata.value.isDupplicate = true;
  formMetadata.value.customerDupplicate = cus;
  router.push("/DI/DICustomer/create");
}

/**
 * Sự kiện khi cập nhật trạng thái của nhân viên (select, active, toggleAll)
 * @param {Object} data object thông báo
 *
 * Author: Dũng (10/05/2023)
 */
function rowStatusOnUpdate(data) {
  const { type, rowIndex } = data;
  if (type == "toggleAllPage") {
    // Nếu không có customer nào đang được chọn
    if (selectedAmountInPage.value == 0) {
      // Chọn tất cả
      selectedAmountInPage.value = rowList.value.length;
      for (const row of rowList.value) {
        row.selected = true;
        row.active = true;
        selectedCusIds.value.push(row.cus.customerId);
      }
    } else {
      // Nếu có ít nhất một customer đang được chọn
      // Hủy chọn tất cả
      selectedAmountInPage.value = 0;
      for (const row of rowList.value) {
        row.selected = false;
        row.active = false;
        const index = selectedCusIds.value.indexOf(row.cus.customerId);
        if (index > -1) selectedCusIds.value.splice(index, 1);
      }
    }
    return;
  }

  if (type == "selected") {
    // Đổi trạng thái selected của row
    rowList.value[rowIndex].selected = !rowList.value[rowIndex].selected;

    // Nếu selected true thì thêm vào selectedCusIds và bật active
    if (rowList.value[rowIndex].selected) {
      ++selectedAmountInPage.value;
      selectedCusIds.value.push(rowList.value[rowIndex].cus.customerId);
      rowList.value[rowIndex].active = true;
      // Tắt active của những ô khác mà không được selected
      for (const row of rowList.value) {
        if (
          row.cus.customerId != rowList.value[rowIndex].cus.customerId &&
          !row.selected
        )
          row.active = false;
      }
    } else {
      --selectedAmountInPage.value;
      // Nếu seleted của customer này false
      // Xóa khỏi selectedCusIds và tắt active
      selectedCusIds.value.splice(
        selectedCusIds.value.indexOf(rowList.value[rowIndex].cus.customerId),
        1
      );
      rowList.value[rowIndex].active = false;
    }
    return;
  }

  if (data.type == "active") {
    // Nếu row này đang không được select thì cập nhật trạng thái active
    if (!rowList.value[rowIndex].selected) {
      rowList.value[rowIndex].active = !rowList.value[rowIndex].active;
    }
    // Nếu row này được bật active
    if (rowList.value[rowIndex].active) {
      // Tắt những row khác đang active mà không selected
      for (const row of rowList.value) {
        if (
          !row.selected &&
          row.cus.customerId != rowList.value[rowIndex].cus.customerId
        )
          row.active = false;
      }
    }
  }
}

/**
 * Sự kiện click vào nút bỏ chọn
 *
 * Author: Dũng (25/05/2023)
 */
function cancelSelectOnClick() {
  for (const row of rowList.value) {
    selectedAmountInPage.value = 0;
    row.selected = false;
    row.active = false;
    selectedCusIds.value = [];
  }
}

/**
 * Sự kiện click vào nút đóng dialog
 *
 * Author: Dũng (08/05/2023)
 */
function dialogCloseOnClick() {
  dialog.value.isDisplay = false;
}

/**
 * Sự kiện click vào nút xóa nhân viên
 * @param {String} cusId Id nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
function deleteCustomerOnClick(cusId) {
  let cusCode = "";
  cache.value.cusDeleteId = cusId;
  for (let index in rowList.value) {
    if (rowList.value[index].cus.customerId == cusId) {
      cache.value.cusDeleteIndex = index;
      cusCode = rowList.value[index].cus.customerCode;
      break;
    }
  }
  showDeleteOneConfirmDialog(cusCode);
}

/**
 * Sự kiện cập nhật trạng thái của object pagingData
 * @param {Object} newData giá trị mới
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingDataOnUpdate(newData) {
  pagingData.value = newData;
  await loadCustomerData();
}

/**
 * Chuyển sang trang paging kế tiếp
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingNextPage() {
  pagingData.value.pageNumber += 1;
  await loadCustomerData();
  // console.log("n next");
}

/**
 * Chuyển sang trang paging trước đó
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingPrevPage() {
  pagingData.value.pageNumber -= 1;
  await loadCustomerData();
  // console.log("p prev");
}

/**
 * Gọi API lấy dữ liệu nhân viên theo filter
 * Author: Dũng (08/05/2023)
 */
async function loadCustomerData() {
  try {
    // Nếu dữ liệu đang được gọi thì return
    if (isLoadingData.value == true) return;
    selectedAmountInPage.value = 0;
    isLoadingData.value = true;
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Gọi API filter KH
    const response = await $axios.get($api.customer.filter, {
      params: {
        skip: pagingData.value.pageSize * (pagingData.value.pageNumber - 1),
        take: pagingData.value.pageSize,
        keySearch: cache.value.cusSearchPattern,
      },
    });
    rowList.value = [];
    // console.log(response.data);
    if (response.data.filteredList) {
      for (const cus of response.data.filteredList) {
        // Chuyển đổi từ customer nhận từ server sang Class customer của frontend
        const cusConverted = new Customer(cus);
        const isSelected = selectedCusIds.value.includes(
          cusConverted.customerId
        );
        if (isSelected) ++selectedAmountInPage.value;
        rowList.value.push({
          active: isSelected,
          selected: isSelected,
          cus: cusConverted,
        });
      }
    }
    // console.log(1);
    // console.log(rowList.value);
    // Số bản ghi ở trang hiện tại
    pagingData.value.curAmount = response.data.filteredList.length ?? 0;
    // Tổng số bản ghi
    pagingData.value.totalRecord = response.data.totalRecord ?? 0;
    // Số bản ghi ở trang hiện tại có trống hay không
    haveDataAfterCallApi.value = pagingData.value.totalRecord != 0;
    isLoadingData.value = false;
  } catch (error) {
    isLoadingData.value = false;
    handleApiErrorResponse(error);
  }
}

/**
 * Sự kiện cập nhật mảng rowList
 * @param {String} type kiểu update (thêm hay sửa)
 * @param {Object} data dữ liệu của customer mới
 * Author: Dũng (08/05/2023)
 */
async function customerOnUpdate(type, data) {
  // console.log("Customer list updated");
  // console.log(type);
  // console.log(data);
  switch (type) {
    case "create":
      pagingData.value.totalRecord += 1;
      pagingData.value.curAmount += 1;
      rowList.value.unshift({
        active: false,
        selected: false,
        cus: data,
      });
      if (pagingData.value.curAmount > 2 * pagingData.value.pageSize) {
        await loadCustomerData();
      }
      pushToast({
        type: "success",
        message: $message.customerCreated,
        timeToLive: 1500,
      });
      break;
    case "edit":
      for (const row of rowList.value) {
        if (row.cus.customerId == data.customerId) {
          row.cus = data;
          break;
        }
      }
      pushToast({
        type: "success",
        message: $message.customerUpdated,
        timeToLive: 1500,
      });
      break;
    default:
      break;
  }
  // await loadCustomerData();
}

function btnAddOnClick() {
  router.push("/CA/CAReceipt/create");
}

// #endregion
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/cash/receipt/receipt-list.css"
></style>
