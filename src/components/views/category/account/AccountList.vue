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
    v-model:metadata="formMetadata"
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
        @update-dupplicate-emp="dupplicateEmpOnUpdate"
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
const formMetadata = ref({
  isDupplicate: false,
  customerDupplicate: null,
});
var sampleData = [
  {
    accountId: "49203211-0b8a-48ec-bb3e-2e138ef40912",
    accountNumber: "112",
    accountNameVi: "Ten tai khoan",
    accountNameEn: "Account name",
    parentId: "",
    property: "",
    description: "",
    status: "Đang sử dụng",
    isParent: true,
    grade: 0,
    mCode: "001",
  },
  {
    accountId: "f016b6e4-62e3-46a0-8f08-abb158ccffd4",
    accountNumber: "1121",
    accountNameVi: "Ten tai khoan 1",
    accountNameEn: "Account name 1",
    parentId: "49203211-0b8a-48ec-bb3e-2e138ef40912",
    property: "",
    description: "",
    status: "Đang sử dụng",
    isParent: true,
    grade: 1,
    mCode: "001/002",
  },
  {
    accountId: "f29efa99-8a42-434a-8dee-a6a13f76b93f",
    accountNumber: "11211",
    accountNameVi: "Ten tai khoan 2",
    accountNameEn: "Account name 2",
    parentId: "f016b6e4-62e3-46a0-8f08-abb158ccffd4",
    property: "",
    description: "",
    status: "Đang sử dụng",
    isParent: false,
    grade: 2,
    mCode: "001/002/003",
  },
  {
    accountId: "97c096fa-ee8c-4ad8-b473-662315448511",
    accountNumber: "323",
    accountNameVi: "Ten tai khoan 5",
    accountNameEn: "Account name 5",
    parentId: "",
    property: "",
    description: "",
    status: "Đang sử dụng",
    isParent: false,
    grade: 0,
    mCode: "004",
  },
  {
    accountId: "761641e2-c8f5-4177-bb6f-9417c03b7e28",
    accountNumber: "11201",
    accountNameVi: "Tai khoan no",
    accountNameEn: "Account name 7",
    parentId: "",
    property: "",
    description: "",
    status: "Đang sử dụng",
    isParent: true,
    grade: 0,
    mCode: "005",
  },
  {
    accountId: "3b734659-7bff-4320-8b12-63aae9590e33",
    accountNumber: "112012",
    accountNameVi: "Tai khoan thu",
    accountNameEn: "Account name 8",
    parentId: "761641e2-c8f5-4177-bb6f-9417c03b7e28",
    property: "",
    description: "",
    status: "Đang sử dụng",
    isParent: false,
    grade: 1,
    mCode: "005/006",
  },
  {
    accountId: "1fd07ec7-c14e-440b-95c4-22017340231a",
    accountNumber: "112014",
    accountNameVi: "Tai khoan so 123",
    accountNameEn: "Account name 123",
    parentId: "761641e2-c8f5-4177-bb6f-9417c03b7e28",
    property: "",
    description: "",
    status: "Đang sử dụng",
    isParent: false,
    grade: 1,
    mCode: "005/007",
  },
];
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
    const response = await $axios.get($api.employee.exportExcel, {
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
 * Sự kiện Employee Table emit dupplicate lên Employee List
 * @param {Object} emp object employee được dupplicate
 *
 * Author: Dũng (10/05/2023)
 */
function dupplicateEmpOnUpdate(emp) {
  formMetadata.value.isDupplicate = true;
  formMetadata.value.employeeDupplicate = emp;
  router.push("/DI/DICustomer/create");
}

/**
 * Sự kiện khi cập nhật trạng thái của nhân viên (select, active, toggleAll)
 * @param {Object} data object thông báo
 *
 * Author: Dũng (10/05/2023)
 */
async function rowStatusOnUpdate(data) {
  const { type, rowIndex } = data;
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
  if (type == "expand") {
    rowList.value[rowIndex].isExpand = !rowList.value[rowIndex].isExpand;
    if (rowList.value[rowIndex].isExpand) {
      let pAccount = rowList.value[rowIndex].acc;
      const filterOption = {
        grade: pAccount.grade + 1,
        listParentId: [pAccount.accountId],
      };
      const filterResponse = await filterAccount(filterOption);
      const childList = filterResponse.filteredList;
      let insertIndex = rowIndex;
      for (const acc of childList) {
        ++insertIndex;
        rowList.value.splice(insertIndex, 0, {
          active: false,
          selected: false,
          acc: acc,
          isExpand: false,
        });
      }
    }
  }
  if (type == "collapse") {
    let collIndex = rowIndex + 1;
    let parentMCode = rowList.value[rowIndex].acc.mCode;
    while (
      collIndex < rowList.value.length &&
      rowList.value[collIndex].acc.mCode.includes(parentMCode)
    ) {
      rowList.value.splice(collIndex, 1);
    }
    rowList.value[rowIndex].isExpand = false;
  }
}

async function filterAccount(filterOption) {
  const dataList = [];
  console.log(filterOption);
  for (const acc of sampleData) {
    console.log(acc);
    if (acc.grade == filterOption.grade) {
      if (filterOption.listParentId.length == 0) dataList.push(acc);
      else {
        if (filterOption.listParentId.includes(acc.parentId))
          dataList.push(acc);
      }
    }
  }
  return {
    totalRecord: dataList.length,
    filteredList: dataList,
  };
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

    // Gọi API filter KH
    // const response = await $axios.get($api.customer.filter, {
    //   params: {
    //     skip: pagingData.value.pageSize * (pagingData.value.pageNumber - 1),
    //     take: pagingData.value.pageSize,
    //     keySearch: cache.value.cusSearchPattern,
    //   },
    // });
    rowList.value = [];
    let filterOption = {
      grade: 0,
      listParentId: [],
    };
    const filterData = await filterAccount(filterOption);
    const response = {
      data: filterData,
    };
    console.log(response.data);
    if (response.data.filteredList) {
      for (const acc of response.data.filteredList) {
        // Chuyển đổi từ customer nhận từ server sang Class customer của frontend
        const accConverted = new Account(acc);
        rowList.value.push({
          active: false,
          selected: false,
          acc: accConverted,
          isExpand: false,
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
 * @param {Object} data dữ liệu của employee mới
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
        await loadAccountData();
      }
      pushToast({
        type: "success",
        message: $message.employeeCreated,
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
        message: $message.employeeUpdated,
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
