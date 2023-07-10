<template>
  <div class="wrapper wrapper--dark1 wrapper--form">
    <div class="form__wrapper" v-show="formNoti.showNotibox">
      <BaseNotibox
        :type="formNoti.notiboxType"
        :message="formNoti.notiboxMessage"
        :yes-on-click="formNotiboxYesBtnOnClick"
        ref="notiRef"
      />
    </div>
    <div class="form__wrapper" v-show="formDialog.isShow">
      <BaseDialog
        :title="lang.dialog.savingChanges.title"
        :message="lang.dialog.savingChanges.message"
        :close-on-click="formDialogCloseBtnOnClick"
        :no-on-click="formDialogNoBtnOnClick"
        :yes-on-click="formDialogYesBtnOnClick"
        ref="dialogRef"
      />
    </div>
    <div class="form__loader" v-show="form.isLoading">
      <BaseLoader />
    </div>
    <div class="form" :class="[form.size == 0 ? 'form--small' : 'form--big']">
      <div class="form__expand">
        <div
          class="expand__icon mi mi-16 mi-chevron-left"
          @click="formExpandOnClick"
        ></div>
      </div>
      <div class="form__header">
        <div class="header__left">
          {{ form.type == "create" ? "Thêm Tài khoản" : "Sửa Tài khoản" }}
        </div>
        <div class="header__right">
          <BaseButton bname="" class="mi-36 btn--help" />
          <BaseButton
            bname=""
            class="mi-36 btn--close"
            @click="closeBtnOnClick"
          />
        </div>
      </div>
      <div class="form__body">
        <div class="form__upper">
          <div class="upper__line w-1_2">
            <div class="line__left flex-1">
              <BaseTextfield
                pholder=""
                label="Số tài khoản"
                :isrequired="true"
                v-model:text="account.accountNumber"
                noti=""
              />
            </div>
          </div>
          <div class="upper__line">
            <div class="line__left flex-1">
              <BaseTextfield
                pholder=""
                label="Tên tài khoản"
                :isrequired="true"
                v-model:text="account.accountNameVi"
                noti=""
              />
            </div>
            <div class="line__right flex-1">
              <BaseTextfield
                pholder=""
                label="Tên tiếng Anh"
                :isrequired="false"
                v-model:text="account.accountNameEn"
                noti=""
              />
            </div>
          </div>
          <div class="upper__line">
            <div class="line__left flex-1">
              <AccountCombobox
                label="Tài khoản tổng hợp"
                v-model:selectedItemId="account.parentId"
                v-model:selectedItemName="account.parentNumber"
              />
            </div>
            <div class="line__right flex-1">
              <BaseCombobox
                label="Tính chất"
                pholder=""
                :isrequired="true"
                :option-list="categoryKindList"
                v-model:text="account.categoryKindName"
                noti=""
                v-model:selectedItemId="account.categoryKind"
              />
            </div>
          </div>
          <div class="upper__line">
            <div class="flex-1">
              <BaseTextfield
                pholder=""
                label="Diễn giải"
                :isrequired="false"
                v-model:text="account.description"
                noti=""
              />
            </div>
          </div>
          <div class="upper__line">
            <BaseCheckbox label="Có hạch toán ngoại tệ" :checked="false" />
          </div>
        </div>
        <div class="form__lower">
          <div class="lower__collapse">
            <div class="collapse__title">
              <div class="title__icon mi mi-16 mi-arrow-right-black"></div>
              <div class="title__text" @click="collapseOnClick">
                Theo dõi chi tiết theo
              </div>
            </div>
            <div class="collapse__option" v-show="!form.collapse">
              <div class="option__line">
                <div class="line__box">
                  <BaseCheckbox
                    label="Đối tượng"
                    :checked="detail.byAccountObject"
                    class="flex-1"
                    @click="detailByAccountObjectOnClick"
                  />
                  <BaseSelectbox
                    class="flex-1"
                    :isActive="detail.byAccountObject"
                    label=""
                    pholder=""
                    :isrequired="false"
                    :option-list="accountObjectOptionList"
                    noti=""
                    v-model:selectedItemId="detail.byAccountObjectKind"
                  />
                </div>
                <div class="line__box">
                  <BaseCheckbox label="Tài khoản ngân hàng" :checked="false" />
                </div>
              </div>
              <div class="option__line">
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Đối tượng THCP"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Công trình"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
              </div>
              <div class="option__line">
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Đơn đặt hàng"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Hợp đồng bán"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
              </div>
              <div class="option__line">
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Hợp đồng mua"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Khoản mục CP"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
              </div>
              <div class="option__line">
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Đơn vị"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
                <div class="line__box">
                  <BaseCheckbox
                    class="flex-1"
                    label="Mã thống kê"
                    :checked="false"
                  />
                  <BaseCombobox
                    class="flex-1"
                    label=""
                    :isrequired="false"
                    :option-list="[]"
                    text=""
                    noti=""
                    selectedItemId=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="m-top-24" />
      <div class="form__footer m-top-24">
        <div class="footer__left">
          <BaseButton bname="Hủy" class="btn--secondary" />
        </div>
        <div class="footer__right">
          <BaseButton
            bname="Cất"
            class="btn--secondary"
            @click="btnSaveOnClick"
          />
          <BaseButton bname="Cất và Thêm" class="btn--primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//#region import
import BaseTextfield from "../../../../components/base/BaseTextfield";
import BaseCombobox from "../../../../components/base/BaseCombobox.vue";
import BaseSelectbox from "@/components/base/BaseSelectbox.vue";
import BaseNotibox from "@/components/base/BaseNotibox.vue";
import BaseCheckbox from "../../../base/BaseCheckbox.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import { nextTick, ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import $enum from "@/js/common/enum";
import $error from "@/js/resources/error";
import $api from "@/js/api";
import { Account } from "@/js/model/account";
import AccountCombobox from "../account/AccountCombobox.vue";
//#endregion

//#region init
const $axios = inject("$axios");
const router = useRouter();
const route = useRoute();
const account = ref({});
const lang = inject("$lang");
// const _ = require("lodash");

var oldAccount = null;
const formDialog = ref({
  isShow: false,
});

const formNoti = ref({
  showNotibox: false,
  notiboxType: "",
  notiboxMessage: "",
});

let firstErrorRef = null;
const notiRef = ref(null);

const form = ref({
  size: 0,
  collapse: true,
  type: "",
  accId: "",
  isLoading: false,
});

const detail = ref({
  byBankAccount: false,
  byAccountObject: false,
  byAccountObjectKind: -1,
});

const accountObjectOptionList = ["Nhà cung cấp", "Khách hàng", "Nhân viên"];

const categoryKindList = [
  {
    optionId: "0",
    optionName: "Dư nợ",
  },
  {
    optionId: "1",
    optionName: "Dư có",
  },
  {
    optionId: "2",
    optionName: "Lưỡng tính",
  },
  {
    optionId: "3",
    optionName: "Không có số dư",
  },
];

const emits = defineEmits(["updateAccList"]);
resetFormState();
//#endregion

//#region hook
onMounted(async () => {
  try {
    // Nếu form là kiểu thông tin account mà id của router không hợp lệ thì quay lại
    if (form.value.type == $enum.form.infoType && !isUUID(form.value.accId)) {
      await router.replace("/DI/DIAccount");
      return;
    }
    form.value.isLoading = true;
    // Lấy dữ liệu từ Server
    await getDataFromApi();
    form.value.isLoading = false;
    // Focus vào ô nhập liệu đầu tiên
    focusOnFirstInput();
  } catch (error) {
    form.value.isLoading = false;
    console.log(error);
    await handleResponseStatusCode(error.response.status, error);
  }
});
//#endregion

//#region function

function focusOnFirstInput() {
  // need
}

/**
 * Reset giá trị customer và trạng thái form
 *
 * Author: Dũng (08/05/2023)
 */
function resetFormState() {
  form.value = {
    size: 0,
    collapse: true,
    type: route.params.id ? $enum.form.infoType : $enum.form.createType,
    accId: route.params.id ?? "",
    isLoading: false,
  };
  account.value = new Account({});
}

/**
 * Quản lý các mã HTTP Code trả về sau khi gọi API
 * @param {code}
 * Author: Dũng (08/05/2023)
 */
async function handleResponseStatusCode(code, error) {
  formNoti.value.notiboxType = "alert";
  if (code == 400) {
    // Trường hợp backend trả về BadRequest
    formNoti.value.notiboxMessage = $error.invalidInput;
    // await displayNotiBox();
  } else if (code == 404) {
    // Trường hợp không tìm thấy ID của nhân viên trên URL
    await router.replace("/DI/DICustomer");
  } else {
    // Các trường hợp còn lại
    formNoti.value.notiboxMessage = error.response.data.UserMessage;
    // await displayNotiBox();
  }
}

/**
 * Gọi API lấy thông tin account và gán vào account object
 * @param {String} accId Id account
 *
 * Author: Dũng (28/06/2023)
 */
async function fetchAccountInfoToCustomerObject(accId) {
  const response = await $axios.get($api.account.one(accId));
  const accFromApi = response.data;
  account.value = new Account(accFromApi);
}

/**
 * Gọi API khởi tạo dữ liệu cho form
 *
 * Author: Dũng (08/05/2023)
 */
async function getDataFromApi() {
  if (form.value.type == $enum.form.infoType) {
    await fetchAccountInfoToCustomerObject(form.value.accId, form.value.type);
    const oldAcc = new Account({});
    oldAcc.cloneFromOtherAccount(account.value);
    oldAccount = oldAcc;
    return;
  }
}

/**
 * Kiểm tra một string có phải UUID không
 *
 * Author: Dũng (11/06/2023)
 */
function isUUID(str) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}
//#endregion

//#region handle event

function collapseOnClick() {
  form.value.collapse = !form.value.collapse;
}

function formExpandOnClick() {
  console.log(form.value.size);
  form.value.size = 1 - form.value.size;
}

function closeBtnOnClick() {
  router.replace("/DI/DIAccount");
}

/**
 * Validate các thông tin có trong form
 *
 * Author: Dũng (08/05/2023)
 */
async function validateData() {
  firstErrorRef = null;
  // need

  // if (!account.value.accountNumber.startsWith(account.value.parentNumber)) {

  // }

  if (firstErrorRef != null) {
    // Update notibox value
    formNoti.value.notiboxType = "alert";
    formNoti.value.notiboxMessage = $error.invalidInput;
  } else {
    formNoti.value.notiboxMessage = "";
  }
}

/**
 * Hiển thị notibox thông báo
 * Author: Duxng(03/06/2023)
 */
async function displayNotiBox() {
  formNoti.value.showNotibox = true;
  await nextTick();
  notiRef.value.yesBtn.refBtn.focus();
}

/**
 * Gọi API tạo mới khách hàng
 *
 * Author: Dũng (08/05/2023)
 */
async function callCreateAccountApi() {
  const requestBody = account.value.convertToApiFormat();
  console.log(requestBody);
  const response = await $axios.post($api.account.index, requestBody);
  return response.data;
}

/**
 * Sự kiện click vào nút cất
 *
 *
 * Author: Dũng (27/06/2023)
 */
async function btnSaveOnClick() {
  try {
    form.value.isLoading = true;

    // Validate dữ liệu của các trường thông tin
    await validateData();

    // Nếu có một lỗi nào đó sau khi validate
    if (formNoti.value.notiboxMessage.length) {
      form.value.isLoading = false;
      // show notibox
      await displayNotiBox();
    } else {
      // Nếu Validate thành công

      // Nếu form là form cập nhật thông tin
      if (form.value.type == $enum.form.infoType) {
        // Gọi API sửa nhân viên
        await callEditAccountApi();
        // Emit sự kiện cập nhật Customer lên CustomerList để cập nhật trên table
        if (oldAccount.parentId != account.value.parentId) {
          // reload lại cây account
          emits("updateAcclist", "edit", {
            account: account.value,
            reload: true,
          });
        } else {
          // không cần reload cây account
          emits("updateAcclist", "edit", {
            account: account.value,
            reload: false,
          });
        }
      } else {
        // Nếu form là form thêm mới hoặc nhân bản
        // Gọi API thêm mới nhân viên
        const newAccountId = await callCreateAccountApi();
        account.value.accountId = newAccountId;
        // Emit sự kiện thêm mới Employee lên EmployeeList để cập nhật trên table
        emits("updateAcclist", "create", {
          account: account.value,
        });
      }

      form.value.isLoading = false;
      router.replace("/DI/DIAccount");
    }
  } catch (error) {
    form.value.isLoading = false;
    console.log(error);
    await handleResponseStatusCode(error.response.status, error);
  }
}

/**
 * Gọi API sửa account
 *
 * Author: Dũng (29/06/2023)
 */
async function callEditAccountApi() {
  const requestBody = account.value.convertToApiFormat();
  console.log(requestBody);
  await $axios.put($api.account.one(form.value.accId), requestBody);
}

/**
 * Focus vào ô lỗi đầu tiên
 *
 * Author: Dũng (08/05/2023)
 */
function focusOnFirstErrorInput() {
  firstErrorRef.value.refInput.focus();
}

/**
 * Sự kiện click vào nút có trong notibox
 * Author: Dũng (08/05/2023)
 */
function formNotiboxYesBtnOnClick() {
  formNoti.value.showNotibox = false;
  focusOnFirstErrorInput();
}

/**
 * Sự kiện click vào nút đóng dialog
 * Author: Dũng (08/05/2023)
 */
async function formDialogCloseBtnOnClick() {
  formDialog.value.isShow = false;
  // Next tick để đợi đến khi formDialog được ẩn đi
  await nextTick();
  if (firstErrorRef != null) {
    focusOnFirstErrorInput();
  } else {
    //customerCodeRef.value.refInput.focus();
    // need
  }
}

/**
 * Sự kiện click vào nút không trong notibox
 * Author: Dũng (08/05/2023)
 */
function formDialogNoBtnOnClick() {
  formDialog.value.isShow = false;
  router.replace("/DI/DICustomer");
}

/**
 * Sự kiện click vào btn yes khi đóng dialog
 *
 * Author: Dũng (27/05/2023)
 */
async function formDialogYesBtnOnClick() {
  formDialog.value.isShow = false;
  await btnSaveOnClick();
}

function detailByAccountObjectOnClick() {
  detail.value.byAccountObject = !detail.value.byAccountObject;
}

//#endregion
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/category/account/account-form.css"
></style>
