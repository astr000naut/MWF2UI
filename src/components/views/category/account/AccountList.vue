<template>
  <div class="page__wrapper" v-show="isLoadingPage">
    <BaseLoader />
  </div>
  <div class="page__wrapper" v-show="dialog.isDisplay">
    <BaseDialog
      :title="lang.dialog.deleteConfirmation.title"
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
    name="CustomerForm"
    @update-cuslist="customerOnUpdate"
  ></router-view>
  <div class="pcontent">
    <div class="pcontent__heading">
      <div class="pcontent__title">{{ lang.cat_account.pageTitle }}</div>
      <BaseButton
        :bname="lang.cat_account.button.addAccount"
        class="btn--primary"
        @click="btnAddOnClick"
      />
    </div>
    <div class="pcontent__goback" @click="goToCategoryOnClick">
      <div class="goback__icon mi mi-16 mi-chevron-left--primary"></div>
      <div class="goback__text">Tất cả danh mục</div>
    </div>
    <div class="pcontent__container">
      <div class="pcontent__searchbar">
        <div class="searchbar__right">
          <BaseTextfield
            :pholder="lang.textfield.searchBar.pholder"
            :hideLabel="true"
            class="txtfield--search mw-300"
            noti=""
            v-model:text="cache.cusSearchPattern"
            :realTimeSearch="true"
            :doSearch="doSearchEmployee"
          />
          <BaseButton class="mi mi-36 mi-refresh" @click="loadAccountData" />
          <div class="button__hoverbox--refresh">
            <div class="hover__arrow"></div>
            <div class="hover__text">{{ lang.button.reload }}</div>
          </div>
          <div
            :class="[isLoadingExport ? 'disabled' : '']"
            class="minc mi-36 mi-excel"
            @click="exportExcelOnClick"
          ></div>
          <div class="button__hoverbox--export">
            <div class="hover__arrow"></div>
            <div class="hover__text">{{ lang.button.export }}</div>
          </div>
          <div class="export__loader" v-show="isLoadingExport">
            <BaseLoader></BaseLoader>
          </div>
        </div>
      </div>
      <AccountTable
        :is-loading-data="isLoadingData"
        :row-list="rowList"
        :key="tableKey"
        :delete-customer-function="deleteCustomerOnClick"
        :have-data-after-call-api="haveDataAfterCallApi"
        v-model:pagingData="pagingData"
        :paging-next-page="pagingNextPage"
        :paging-prev-page="pagingPrevPage"
        @update-paging-data="pagingDataOnUpdate"
        @update-row-status="rowStatusOnUpdate"
      />
    </div>
  </div>
</template>

<script setup>
// #region import
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { useRouter } from "vue-router";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseToastbox from "@/components/base/BaseToastbox.vue";
import $api from "@/js/api";
import { Account } from "@/js/model/account";
import $error from "../../../../js/resources/error";
import $message from "../../../../js/resources/message";
import $enum from "@/js/common/enum";
import AccountTable from "./AccountTable.vue";
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

const toastList = ref([]);
var toastId = 0;
// #endregion

// #region hook
onMounted(async () => {
  // Gọi API lấy danh sách account
  await loadAccountData();
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
async function doSearchEmployee() {
  pagingData.value.pageNumber = 1;
  await loadAccountData();
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

    isLoadingPage.value = false;

    // Update pagingData
    // Cập nhật lại thông tin số bản ghi khách hàng
    pagingData.value.curAmount -= 1;
    pagingData.value.totalRecord -= 1;
    if (pagingData.value.curAmount == 0) {
      // Nếu trang hiện tại bị xóa hết thì load lại trang trước đó
      if (pagingData.value.pageNumber > 1) --pagingData.value.pageNumber;
      await loadAccountData();
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

// #endregion

// #region handle event
/**
 * Sự kiện click Tất cả danh mục
 *
 * Author: Dũng (21/06/2023)
 */
function goToCategoryOnClick() {
  router.push("/DI");
}

/**
 * Sự kiện click Export Excel
 *
 * Author: Dũng (04/06/2023)
 */
async function exportExcelOnClick() {
  try {
    if (isLoadingExport.value) return;
    isLoadingExport.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Gọi api xuất file excel
    const response = await $axios.get("", {
      responseType: "blob",
    });

    // Tạo URL cho blob data
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Tạo thẻ a và gắn url blob data vào
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", $enum.exportedFileName);

    // Append link element vào DOM và tự click để download
    document.body.appendChild(link);
    link.click();

    // Remove các element vừa mới tạo khỏi trang
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    isLoadingExport.value = false;
  } catch (error) {
    isLoadingExport.value = false;
    console.log(error);
    pushToast({
      type: "fail",
      message: $error.exportFailed,
    });
  }
}

/**
 * Sự kiện khi cập nhật trạng thái của nhân viên (select, active, toggleAll)
 * @param {Object} data object thông báo
 *
 * Author: Dũng (10/05/2023)
 */
async function rowStatusOnUpdate(data) {
  const { type, itemId } = data;
  let rowIndex = 0;
  for (let i = 0; i < rowList.value.length; ++i) {
    if (rowList.value[i].acc.accountId == itemId) {
      rowIndex = i;
      break;
    }
  }
  if (type == "active") {
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
          row.acc.accountId != rowList.value[rowIndex].acc.accountId
        )
          row.active = false;
      }
    }
  }
  if (type == "ExpandCollapse") {
    rowList.value[rowIndex].isExpand = !rowList.value[rowIndex].isExpand;
    if (rowList.value[rowIndex].isExpand) {
      let expandedAmount = 0;
      // Nếu có con từ dữ liệu cũ rồi thì không gọi api lấy con nữa
      if (
        rowIndex + 1 < rowList.value.length &&
        rowList.value[rowIndex + 1].acc.parentId ==
          rowList.value[rowIndex].acc.accountId
      ) {
        // Expand những thằng con cháu của nó
        for (let i = rowIndex + 1; i < rowList.value.length; ++i) {
          if (rowList.value[i].acc.parentId == itemId) {
            rowList.value[i].active = false;
            rowList.value[i].display = true;
            rowList.value[i].isExpand = false;
            ++expandedAmount;
          }
        }
      } else {
        let pAccount = rowList.value[rowIndex].acc;
        const filterOption = {
          grade: pAccount.grade + 1,
          listParentId: pAccount.accountId,
        };
        const filterData = await filterAccount(filterOption);
        const childList = filterData.filteredList;
        expandedAmount = childList.length;
        let insertIndex = rowIndex;
        for (const acc of childList) {
          ++insertIndex;
          rowList.value.splice(insertIndex, 0, {
            active: false,
            display: true,
            acc: acc,
            isExpand: false,
          });
        }
      }
      pagingData.value.curAmount += expandedAmount;
    } else {
      let collapsedAmount = 0;
      // Collapse những thằng con cháu của nó
      for (let i = rowIndex + 1; i < rowList.value.length; ++i) {
        if (
          rowList.value[i].display &&
          rowList.value[i].acc.mCodeId.includes(
            rowList.value[rowIndex].acc.mCodeId
          )
        ) {
          rowList.value[i].active = false;
          rowList.value[i].display = false;
          rowList.value[i].isExpand = false;
          ++collapsedAmount;
        }
      }
      pagingData.value.curAmount -= collapsedAmount;
    }
  }
}

async function filterAccount(filterOption) {
  try {
    const response = await $axios.get($api.account.filter, {
      params: filterOption,
    });
    return response.data;
  } catch (error) {
    handleApiErrorResponse(error);
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
  await loadAccountData();
}

/**
 * Chuyển sang trang paging kế tiếp
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingNextPage() {
  pagingData.value.pageNumber += 1;
  await loadAccountData();
  // console.log("n next");
}

/**
 * Chuyển sang trang paging trước đó
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingPrevPage() {
  pagingData.value.pageNumber -= 1;
  await loadAccountData();
  // console.log("p prev");
}

/**
 * Gọi API lấy dữ liệu nhân viên theo filter
 * Author: Dũng (08/05/2023)
 */
async function loadAccountData() {
  try {
    // Nếu dữ liệu đang được gọi thì return
    if (isLoadingData.value == true) return;
    isLoadingData.value = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    rowList.value = [];
    let filterOption = {
      grade: 0,
      listParentId: "",
    };
    const filterData = await filterAccount(filterOption);
    if (filterData.filteredList) {
      for (const acc of filterData.filteredList) {
        // Chuyển đổi từ customer nhận từ server sang Class customer của frontend
        const accConverted = new Account(acc);
        rowList.value.push({
          active: false,
          display: true,
          acc: accConverted,
          isExpand: false,
        });
      }
    }
    // Số bản ghi ở trang hiện tại
    pagingData.value.curAmount = filterData.filteredList.length ?? 0;
    // Tổng số bản ghi
    pagingData.value.totalRecord = filterData.totalRecord ?? 0;
    // Số bản ghi ở trang hiện tại có trống hay không
    haveDataAfterCallApi.value = pagingData.value.totalRecord != 0;
    isLoadingData.value = false;
  } catch (error) {
    isLoadingData.value = false;
    handleApiErrorResponse(error);
  }
}

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
        display: true,
        selected: false,
        cus: data,
      });
      if (pagingData.value.curAmount > 2 * pagingData.value.pageSize) {
        await loadAccountData();
      }
      pushToast({
        type: "success",
        message: "Tạo mới tài khoản thành công (fixed)",
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
        message: "Cập nhật tài khoản thành công (fixed)",
        timeToLive: 1500,
      });
      break;
    default:
      break;
  }
  // await loadAccountData();
}

/**
 * Sự kiện click vào nút thêm
 * Author: Dũng (08/05/2023)
 */
function btnAddOnClick() {
  router.replace("/DI/DIAccount/create");
}

// #endregion
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/category/account/account-list.css"
></style>
