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
    <div class="form">
      <div class="form__header">
        <div class="header__left">
          {{
            form.type == "info"
              ? "Sửa thông tin khách hàng"
              : "Thêm mới khách hàng"
          }}
        </div>
        <div class="header__mid">
          <div class="hm__left">
            <BaseRadiogroup
              label=""
              :options="[
                { text: 'Tổ chức', value: 0 },
                {
                  text: 'Cá nhân',
                  value: 1,
                },
              ]"
              v-model:radioValue="customer.customerType"
            />
          </div>
          <div class="hm__right">
            <div
              class="checkbox mi mi-18"
              :class="[customer.isProvider ? 'mi-checkbox-checked' : '']"
              @click="customer.isProvider = !customer.isProvider"
            ></div>
            <div class="checkbox__label">Là nhà cung cấp</div>
          </div>
        </div>
        <div class="header__right">
          <BaseButton bname="" class="mi-36 btn--help" v-tooltip="'Giúp'" />
          <BaseButton
            bname=""
            class="mi-36 btn--close"
            v-tooltip="'Đóng (ESC)'"
            @click="closeBtnOnClick"
          />
        </div>
      </div>
      <div class="form__body">
        <div class="form__upper">
          <div class="fu__left">
            <div
              class="fu__left__top"
              :style="{
                flexDirection: customer.customerType == 1 ? 'row-reverse' : '',
              }"
            >
              <div class="fu__taxCode">
                <BaseTextfield
                  pholder=""
                  label="Mã số thuế"
                  :isrequired="false"
                  v-model:text="customer.customerTIN"
                  noti=""
                  ref="customerTINRef"
                />
              </div>
              <div class="fu__code">
                <BaseTextfield
                  pholder=""
                  label="Mã khách hàng"
                  autoFillMessage="Shift + F8 để tự tạo mã"
                  :autoFill="generateCusCode"
                  :isrequired="true"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                  ref="customerCodeRef"
                />
              </div>
            </div>
            <div
              class="fu__left__mid m-top-24"
              v-show="customer.customerType == 0"
            >
              <div class="fu__name">
                <BaseTextfield
                  pholder=""
                  label="Tên khách hàng"
                  :isrequired="true"
                  v-model:text="customer.customerFullName"
                  v-model:noti="formNoti.customerFullName"
                  ref="oCustomerFullNameRef"
                />
              </div>
            </div>
            <div
              class="fu__left__mid m-top-24"
              v-show="customer.customerType == 1"
            >
              <div class="fu__name_xungho">
                <BaseTextfield
                  pholder=""
                  label="Xưng hô"
                  :isrequired="false"
                  v-model:text="customer.contactNamePrefix"
                  noti=""
                />
              </div>
              <div class="fu__name_real">
                <BaseTextfield
                  pholder="Họ và tên"
                  label="Tên khách hàng"
                  :isrequired="true"
                  v-model:text="customer.customerFullName"
                  v-model:noti="formNoti.customerFullName"
                  ref="pCustomerFullNameRef"
                />
              </div>
            </div>
            <div class="fu__left__bot m-top-24">
              <div class="fu__address">
                <BaseTextfield
                  pholder=""
                  label="Địa chỉ"
                  :isrequired="false"
                  v-model:text="customer.address"
                  noti=""
                />
              </div>
            </div>
          </div>
          <div class="fu__right">
            <div
              class="fu__right__top m-bot-24"
              v-show="customer.customerType == 0"
            >
              <div class="fu__phone">
                <BaseTextfield
                  pholder=""
                  label="Điện thoại"
                  :isrequired="false"
                  v-model:text="customer.phoneNumber"
                  noti=""
                />
              </div>
              <div class="fu__website">
                <BaseTextfield
                  pholder=""
                  label="Website"
                  :isrequired="false"
                  v-model:text="customer.website"
                  noti=""
                />
              </div>
            </div>
            <div class="fu__right__mid m-bot-24">
              <BaseComboboxMultiSelect
                v-model:selectedElementCode="customer.groupCodeList"
              />
            </div>
            <div class="fu__right__bot">
              <EmployeeCombobox
                v-model:selectedEmployeeId="customer.employeeId"
                v-model:selectedEmployeeName="customer.employeeFullName"
                :table-structure="employeeComboboxTableStructure"
              />
            </div>
          </div>
        </div>
        <div class="form__lower m-top-24">
          <div class="fl__tablist">
            <div
              class="tab__info"
              :class="[tab.id == selectedTabId ? 'active' : '']"
              v-for="tab in tabList"
              :key="tab.id"
              @click="tabInfoOnClick(tab.id)"
            >
              {{ tab.name }}
            </div>
          </div>
          <div class="fl__main">
            <div class="main__panel main__info" v-show="selectedTabId == 0">
              <div class="main__info__left">
                <div class="custype--org" v-show="customer.customerType == 0">
                  <div class="mileft__top">
                    <div class="mileft__call">
                      <BaseTextfield
                        pholder="Xưng hô"
                        label="Người liên hệ"
                        :isrequired="false"
                        v-model:text="customer.contactNamePrefix"
                        noti=""
                      />
                    </div>
                    <div class="mileft__name">
                      <BaseTextfield
                        pholder="Họ và tên"
                        label=""
                        :isrequired="false"
                        v-model:text="customer.contactName"
                        noti=""
                      />
                    </div>
                  </div>
                  <div class="mileft__mid m-top-6">
                    <BaseTextfield
                      pholder="Email"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.contactEmail"
                      noti=""
                    />
                  </div>
                  <div class="mileft__bot m-top-6">
                    <BaseTextfield
                      pholder="Số điện thoại"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.contactMobile"
                      noti=""
                    />
                  </div>
                </div>
                <div class="custype--per" v-show="customer.customerType == 1">
                  <BaseTextfield
                    pholder="Email"
                    label="Thông tin liên hệ"
                    :isrequired="false"
                    v-model:text="customer.contactEmail"
                    noti=""
                  />
                  <BaseTextfield
                    class="m-top-6"
                    pholder="Điện thoại di động"
                    label=""
                    :isrequired="false"
                    v-model:text="customer.phoneNumber"
                    noti=""
                  />
                  <BaseTextfield
                    class="m-top-6"
                    pholder="Điện thoại cố định"
                    label=""
                    :isrequired="false"
                    v-model:text="customer.landLineNumber"
                    noti=""
                  />
                </div>
                <div class="mileft__last m-top-12">
                  <BaseTextfield
                    pholder="Đại diện theo PL"
                    label="Đại diện theo PL"
                    tooltip="Đại diện theo pháp luật"
                    :isrequired="false"
                    v-model:text="customer.legalRepresentative"
                    noti=""
                  />
                </div>
              </div>
              <div class="main__info__right">
                <div class="miright--org" v-show="customer.customerType == 0">
                  <div class="miright__top">
                    <BaseTextfield
                      pholder="Họ và tên"
                      label="Người nhận hóa đơn điện tử"
                      :isrequired="false"
                      v-model:text="customer.envoiceContactName"
                      noti=""
                    />
                  </div>
                  <div class="miright__mid m-top-6">
                    <BaseTextfield
                      pholder="Email (Ngăn cách nhiều email bởi dấu chấm phẩy ';')"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.envoiceContactEmail"
                      noti=""
                    />
                  </div>
                  <div class="miright__bot m-top-6">
                    <BaseTextfield
                      pholder="Số điện thoại"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.envoiceContactMobile"
                      noti=""
                    />
                  </div>
                </div>
                <div class="miright--per" v-show="customer.customerType == 1">
                  <BaseTextfield
                    pholder="Số CMND/Thẻ căn cước"
                    label="Thông tin CMND/Thẻ căn cước"
                    :isrequired="false"
                    v-model:text="customer.identityNumber"
                    noti=""
                  />
                  <BaseDatepicker
                    pholder="Ngày cấp"
                    class="m-top-6"
                    label=""
                    v-model:inputText="customer.identityDate"
                    noti=""
                  />
                  <BaseTextfield
                    class="m-top-6"
                    pholder="Nơi cấp"
                    label=""
                    :isrequired="false"
                    v-model:text="customer.identityPlace"
                    noti=""
                  />
                </div>
              </div>
            </div>
            <div class="main__panel main__purchase" v-show="selectedTabId == 1">
              <div class="mp__top">
                <div class="mp__top__left">
                  <BaseTextfield
                    pholder=""
                    label="Điều khoản thanh toán"
                    :isrequired="false"
                    v-model:text="customer.paymentTermName"
                    noti=""
                  />
                </div>
                <div class="mp__top__mid">
                  <BaseTextfield
                    pholder=""
                    label="Số ngày được nợ"
                    :isrequired="false"
                    v-model:text="customer.dueTime"
                    noti=""
                  />
                </div>
                <div class="mp__top__right">
                  <BaseTextfield
                    pholder=""
                    label="Số nợ tối đa"
                    :isrequired="false"
                    type="money"
                    v-model:text="customer.maximizeDebtAmount"
                    @update:text="textOnUpdate"
                    noti=""
                  />
                </div>
              </div>
              <div class="mp__mid m-top-12">
                <div class="receive-account">
                  <div class="ra__label">Tài khoản công nợ phải thu</div>
                  <FormAccountCombobox
                    :mheight="240"
                    v-model:selectedItemName="customer.receiveAccount"
                    v-model:selectedItemId="customer.receiveAccountId"
                  />
                </div>
                <div class="pay-account" v-if="customer.isProvider">
                  <div class="ra__label">Tài khoản công nợ phải trả</div>
                  <FormAccountCombobox
                    :mheight="240"
                    v-model:selectedItemName="customer.payAccount"
                    v-model:selectedItemId="customer.payAccountId"
                  />
                </div>
              </div>
            </div>
            <div class="main__panel main__bankacc" v-show="selectedTabId == 2">
              <div class="ba__table__container">
                <table class="bankacc__table">
                  <thead>
                    <tr>
                      <th>
                        <div class="text-left">Số tài khoản</div>
                      </th>
                      <th>
                        <div class="text-left">Tên ngân hàng</div>
                      </th>
                      <th>
                        <div class="text-left">Chi nhánh</div>
                      </th>
                      <th>
                        <div class="text-left">Tỉnh/TP của ngân hàng</div>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(bankAcc, index) in customer.bankAccountList"
                      :key="bankAcc.id"
                      ref="bankAccRowRefs"
                    >
                      <td>
                        <div class="td__wrapper">
                          <input type="text" v-model="bankAcc.bankAccount" />
                        </div>
                      </td>
                      <td>
                        <div class="td__wrapper">
                          <input type="text" v-model="bankAcc.bankName" />
                        </div>
                      </td>
                      <td>
                        <div class="td__wrapper">
                          <input type="text" v-model="bankAcc.bankBranch" />
                        </div>
                      </td>
                      <td>
                        <div class="td__wrapper">
                          <input type="text" v-model="bankAcc.bankProvince" />
                        </div>
                      </td>
                      <td>
                        <div
                          class="delete__button"
                          @click="customerBankAccDeleteOnClick(index)"
                        >
                          <div class="delete__icon mi mi-16 mi-delete"></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="table__control">
                <BaseButton
                  bname="Thêm dòng"
                  class="btn--secondary"
                  @click="bankAccAddOnClick"
                />
                <BaseButton
                  bname="Xóa hết dòng"
                  class="btn--secondary"
                  @click="bankAccDeleteAllOnClick"
                />
              </div>
            </div>
            <div class="main__panel main__oaddress" v-show="selectedTabId == 3">
              <div class="oad__left">
                <div class="oad__left__top">
                  <BaseCombobox
                    label="Vị trí địa lý"
                    pholder="Quốc gia"
                    :isrequired="false"
                    :option-list="countryList"
                    v-model:text="customer.country"
                    noti=""
                    v-model:selectedItemId="customer.countryId"
                    :schema="countryCboxSchema"
                    :mxheight="200"
                  />

                  <BaseCombobox
                    label=""
                    pholder="Tỉnh/Thành phố"
                    :isrequired="false"
                    :option-list="provinceList"
                    v-model:text="customer.provinceOrCity"
                    noti=""
                    v-model:selectedItemId="customer.provinceOrCityId"
                    :schema="provinceCboxSchema"
                    :mxheight="200"
                  />
                </div>
                <div class="oad__left__bot m-top-6">
                  <BaseCombobox
                    label=""
                    pholder="Quận/Huyện"
                    :isrequired="false"
                    :option-list="districtList"
                    v-model:text="customer.district"
                    noti=""
                    v-model:selectedItemId="customer.districtId"
                    :schema="districtCboxSchema"
                    :mxheight="200"
                  />

                  <BaseCombobox
                    label=""
                    pholder="Xã/Phường"
                    :isrequired="false"
                    :option-list="wardList"
                    v-model:text="customer.wardOrCommune"
                    noti=""
                    v-model:selectedItemId="customer.wardOrCommuneId"
                    :schema="wardCboxSchema"
                    :mxheight="200"
                  />
                </div>
              </div>
              <div class="oad__right">
                <div class="oad__right__title">
                  <div class="title__text">Địa chỉ giao hàng</div>
                  <BaseCheckbox
                    label="Giống địa chỉ khách hàng"
                    v-model:checked="customer.shippingAddressList.sameOfAddress"
                    @click="sameOfAddressOnClick"
                  />
                </div>
                <div class="oad__right__table m-top-6">
                  <table class="oad__table">
                    <tbody>
                      <tr
                        v-for="(item, index) in customer.shippingAddressList
                          .list"
                        :key="item.id"
                        ref="osAddressRowRefs"
                      >
                        <td>
                          <div class="address__input">
                            <input type="text" v-model="item.address" />
                          </div>
                        </td>
                        <td>
                          <div
                            class="delete__button"
                            @click="osAddressBtnDeleteOnClick(index)"
                          >
                            <div class="delete__icon mi mi-16 mi-delete"></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="oad__right__control m-top-12">
                  <BaseButton
                    bname="Thêm dòng"
                    class="btn--secondary"
                    @click="osAddressBtnAddOnClick"
                  />
                  <BaseButton
                    bname="Xóa hết dòng"
                    class="btn--secondary"
                    @click="deleteAllShippingAddressOnClick"
                  />
                </div>
              </div>
            </div>
            <div class="main__panel main__note" v-show="selectedTabId == 4">
              <div class="text__area">
                <div class="text__area__label">Ghi chú</div>
                <textarea
                  name=""
                  id=""
                  cols="100"
                  rows="10"
                  v-model="customer.description"
                ></textarea>
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
            v-tooltip:top="'Cất (Ctrl + S)'"
          />
          <BaseButton
            bname="Cất và Thêm"
            class="btn--primary"
            v-tooltip:top="'Cất (Ctrl + Shift + S)'"
            @click="btnSaveAndAddOnClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//#region import
import EmployeeCombobox from "./EmployeeCombobox.vue";
import FormAccountCombobox from "../../cash/receipt/FormAccountCombobox.vue";
import { nextTick, ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLocation } from "@/js/composables/use-location";
import $enum from "@/js/common/enum";
import $error from "@/js/resources/error";
import $api from "@/js/api";
import { Customer } from "@/js/model/customer";
import { v4 as uuidv4 } from "uuid";

const _ = require("lodash");
//#endregion

//#region init
const $axios = inject("$axios");
const router = useRouter();
const route = useRoute();
const customer = ref({});
const lang = inject("$lang");

const formDialog = ref({
  isShow: false,
});

const dialogRef = ref(null);

const formNoti = ref({
  showNotibox: false,
  notiboxType: "",
  notiboxMessage: "",

  customerCode: "",
  customerFullName: "",
});
const countryCboxSchema = {
  id: "countryId",
  name: "name",
};
const provinceCboxSchema = {
  id: "provinceId",
  name: "name",
};
const districtCboxSchema = {
  id: "districtId",
  name: "name",
};
const wardCboxSchema = {
  id: "wardId",
  name: "name",
};

let firstErrorRef = null;
const selectedTabId = ref(0);
const tabList = ref([
  {
    id: 0,
    name: "Thông tin liên hệ",
  },
  {
    id: 1,
    name: "Điều khoản thanh toán",
  },
  {
    id: 2,
    name: "Tài khoản ngân hàng",
  },
  {
    id: 3,
    name: "Địa chỉ khác",
  },
  {
    id: 4,
    name: "Ghi chú",
  },
]);

const bankAccRowRefs = ref([]);
const osAddressRowRefs = ref([]);
const notiRef = ref(null);

const form = ref({
  type: "",
  cusId: "",
  isLoading: false,
});

var oldCustomer = null;

const customerCodeRef = ref(null);
const customerTINRef = ref(null);
const oCustomerFullNameRef = ref(null);
const pCustomerFullNameRef = ref(null);

const employeeComboboxTableStructure = [
  {
    name: "Mã nhân viên",
    prop: "employeeCode",
    align: "text-left",
    width: 200,
  },
  {
    name: "Tên nhân viên",
    prop: "employeeFullName",
    align: "text-left",
    width: 248,
  },
];

const { countryList, provinceList, districtList, wardList } =
  useLocation(customer);

const props = defineProps({
  metadata: Object,
});
const emits = defineEmits(["updateCuslist", "update:metadata"]);
resetFormState();
//#endregion

//#region hook
onMounted(async () => {
  try {
    // Nếu form là kiểu thông tin nhân viên mà id của router không hợp lệ thì quay lại trang /DI/DICustomer
    if (form.value.type == $enum.form.infoType && !isUUID(form.value.cusId)) {
      await router.replace("/DI/DICustomer");
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
    await handleResponseStatusCode(error);
  }
});
//#endregion

//#region function

function focusOnFirstInput() {
  if (customer.value.customerType == $enum.customer.type.org) {
    customerTINRef.value.refInput.focus();
  } else {
    customerCodeRef.value.refInput.focus();
  }
}

/**
 * Reset giá trị customer và trạng thái form
 *
 * Author: Dũng (08/05/2023)
 */
function resetFormState() {
  form.value = {
    type: route.params.id
      ? $enum.form.infoType
      : props.metadata.isDupplicate
      ? $enum.form.dupplicateType
      : $enum.form.createType,
    cusId: route.params.id ?? "",
    isLoading: false,
  };
  // Nếu form là dupplicate thì tắt bỏ cờ báo isDupplicate để lần sau mở lại form không bị vào trường hợp dupplicate nữa
  if (form.value.type == $enum.form.dupplicateType) {
    emits("update:metadata", {
      isDupplicate: false,
      customerDupplicate: props.metadata.customerDupplicate,
    });
  }
  customer.value = new Customer({});
}

/**
 * Quản lý các mã HTTP Code trả về sau khi gọi API
 * @param {code}
 * Author: Dũng (08/05/2023)
 */
async function handleResponseStatusCode(error) {
  if (error == null || error.response == null) return;
  let code = error.response.status;
  formNoti.value.notiboxType = "alert";
  console.log(code);
  console.log(error);
  if (code == 400) {
    // Trường hợp backend trả về BadRequest
    formNoti.value.notiboxMessage = $error.invalidInput;
    console.log(1);
    await displayNotiBox();
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
 * Gọi API lấy thông tin khách hàng và gán vào customer object
 * @param {String} cusId Id khách hàng
 *
 * Author: Dũng (28/06/2023)
 */
async function fetchCustomerInfoToCustomerObject(cusId) {
  const response = await $axios.get($api.customer.one(cusId));
  const cusFromApi = response.data;
  customer.value = new Customer(cusFromApi);
}

/**
 * Gọi API khởi tạo dữ liệu cho form
 *
 * Author: Dũng (08/05/2023)
 */
async function getDataFromApi() {
  if (form.value.type == $enum.form.createType) {
    // Fetch new customer code
    await fetchNewCustomerCode();
    return;
  }

  if (form.value.type == $enum.form.infoType) {
    // Fetch customer information
    await fetchCustomerInfoToCustomerObject(form.value.cusId, form.value.type);
    const oldCus = new Customer({});
    oldCus.cloneFromOtherCustomer(customer.value);
    oldCustomer = oldCus;
    return;
  }

  if (form.value.type == $enum.form.dupplicateType) {
    const cus = new Customer({});
    cus.cloneFromOtherCustomer(props.metadata.customerDupplicate);
    customer.value = cus;
    customer.value.customerCode = "";
    customer.value.customerId = "";
    await fetchNewCustomerCode();
    return;
  }
}

/**
 * Gọi API lấy mã nhân viên mới
 *
 * Author: Dũng (08/05/2023)
 */
async function fetchNewCustomerCode() {
  const response = await $axios.get($api.customer.newCode);
  customer.value.customerCode = response.data;
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
async function closeBtnOnClick() {
  if (_.isEqual(oldCustomer, customer.value)) {
    router.replace("/DI/DICustomer");
  }
  formDialog.value.isShow = true;
  await nextTick();
  await dialogRef.value.yesBtn.refBtn.focus();
}

function textOnUpdate() {
  console.log(customer.value.maximizeDebtAmount);
}

function tabInfoOnClick(tabId) {
  selectedTabId.value = tabId;
}

function bankAccDeleteAllOnClick() {
  customer.value.bankAccountList = [];
}

async function bankAccAddOnClick() {
  customer.value.bankAccountList.push({
    id: uuidv4(),
    bankAccount: "",
    bankName: "",
    bankBranch: "",
    bankProvince: "",
  });
  await nextTick();
  bankAccRowRefs.value[
    customer.value.bankAccountList.length - 1
  ].firstChild.firstChild.firstChild.focus();
}

function customerBankAccDeleteOnClick(index) {
  customer.value.bankAccountList.splice(index, 1);
}

function deleteAllShippingAddressOnClick() {
  customer.value.shippingAddressList.list = [];
  customer.value.shippingAddressList.sameOfAddress = false;
}

async function osAddressBtnAddOnClick() {
  customer.value.shippingAddressList.list.push({
    id: uuidv4(),
    address: "",
  });
  await nextTick();
  osAddressRowRefs.value[
    customer.value.shippingAddressList.list.length - 1
  ].firstChild.firstChild.firstChild.focus();
}

function osAddressBtnDeleteOnClick(index) {
  customer.value.shippingAddressList.list.splice(index, 1);
}

/**
 * Validate các thông tin có trong form
 *
 * Author: Dũng (08/05/2023)
 */
async function validateData() {
  firstErrorRef = null;
  // Validate mã khách hàng
  // Mã trống
  if (customer.value.customerCode.trim() == "") {
    customer.value.customerCode = "";
    formNoti.value.customerCode = $error.fieldCannotEmpty("Mã khách hàng");
    firstErrorRef = firstErrorRef ?? customerCodeRef;
  } else {
    // Mã quá dài
    if (customer.value.customerCode.length > 50) {
      formNoti.value.customerCode = $error.fieldTooLong("Mã khách hàng", 50);
      firstErrorRef = firstErrorRef ?? customerCodeRef;
    } else {
      // Kiểm tra trùng mã
      const isCodeExist = await isCusCodeExist(
        customer.value.customerCode,
        form.value.cusId
      );
      if (isCodeExist) {
        formNoti.value.customerCode = "Mã khách hàng đã tồn tại";
        firstErrorRef = firstErrorRef ?? customerCodeRef;
      }
    }
  }
  // Kiểm tra tên KH
  // Tên bị trống
  if (customer.value.customerFullName.trim() == "") {
    formNoti.value.customerFullName = $error.fieldCannotEmpty("Tên khách hàng");

    if (firstErrorRef == null)
      firstErrorRef =
        customer.value.customerType == 0
          ? oCustomerFullNameRef
          : pCustomerFullNameRef;
  } else {
    // Tên quá dài
    if (customer.value.customerFullName.length > 100) {
      formNoti.value.customerFullName = $error.fieldTooLong(
        "Tên khách hàng",
        100
      );
      if (firstErrorRef == null)
        firstErrorRef =
          customer.value.customerType == 0
            ? oCustomerFullNameRef
            : pCustomerFullNameRef;
    }
  }

  if (firstErrorRef != null) {
    // Update notibox value
    formNoti.value.notiboxType = "alert";
    formNoti.value.notiboxMessage = $error.invalidInput;
  } else {
    formNoti.value.notiboxMessage = "";
  }
}

/**
 * Kiểm tra mã customerCode đã tồn tại chưa
 * @param {String} cusCode mã cần check
 * @param {String} cusId id cua cus (chỉ cần nếu form là form sửa)
 * Author: Dux(28/06/2023)
 */
async function isCusCodeExist(cusCode, cusId) {
  const response = await $axios.get($api.customer.checkCodeExist, {
    params: {
      id: cusId,
      code: cusCode,
    },
  });
  return response.data;
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
async function callCreateCustomerApi() {
  const requestBody = customer.value.convertToApiFormat();
  const response = await $axios.post($api.customer.index, requestBody);
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
        await callEditCustomerApi();
        // Emit sự kiện cập nhật Customer lên CustomerList để cập nhật trên table
        emits("updateCuslist", "edit", customer.value);
      } else {
        // Nếu form là form thêm mới hoặc nhân bản
        // Gọi API thêm mới nhân viên
        const newCustomerId = await callCreateCustomerApi();
        customer.value.customerId = newCustomerId;
        // Emit sự kiện thêm mới Employee lên EmployeeList để cập nhật trên table
        emits("updateCuslist", "create", customer.value);
      }

      form.value.isLoading = false;
      router.replace("/DI/DICustomer");
    }
  } catch (error) {
    form.value.isLoading = false;
    console.log(error);
    await handleResponseStatusCode(error);
  }
}

/**
 * Gọi API sửa khách hàng
 *
 * Author: Dũng (29/06/2023)
 */
async function callEditCustomerApi() {
  const requestBody = customer.value.convertToApiFormat();
  console.log(requestBody);
  await $axios.put($api.customer.one(form.value.cusId), requestBody);
}

/**
 * Focus vào ô lỗi đầu tiên
 *
 * Author: Dũng (08/05/2023)
 */
function focusOnFirstErrorInput() {
  if (firstErrorRef != null) firstErrorRef.value.refInput.focus();
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
    customerCodeRef.value.refInput.focus();
  }
}

function sameOfAddressOnClick() {
  if (customer.value.shippingAddressList.sameOfAddress) {
    customer.value.shippingAddressList.list = [
      {
        id: uuidv4(),
        address: customer.value.address,
      },
    ];
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

async function btnSaveAndAddOnClick() {
  try {
    form.value.isLoading = true;
    // Validate dữ liệu
    await validateData();

    // Nếu có một lỗi nào đó sau khi validate
    if (formNoti.value.notiboxMessage != "") {
      form.value.isLoading = false;
      // show notibox
      await displayNotiBox();
    } else {
      // Nếu validate thành công
      // Nếu form là form cập nhật thông tin
      if (form.value.type == $enum.form.infoType) {
        // edit
        await callEditCustomerApi();

        // Emit sự kiện cập nhật lên List để cập nhật trên table
        emits("updateCuslist", "edit", customer.value);
      } else {
        // Nếu form là form thêm mới hoặc nhân bản
        const newId = await callCreateCustomerApi();
        customer.value.customerId = newId;

        // Emit sự kiện thêm mới lên List để cập nhật trên table
        emits("updateCuslist", "create", customer.value);
      }

      form.value.isLoading = false;
      // Quay lại trang /DI/DIEmployee/create
      await router.replace("/DI/DICustomer/create");

      // Reset lại các trường thông tin trên form
      resetFormState();

      // Lấy mãmới
      await fetchNewCustomerCode();

      // Focus vào ô mã
      customerCodeRef.value.refInput.focus();
    }
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error);
  }
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

async function generateCusCode() {
  try {
    form.value.isLoading = true;
    await fetchNewCustomerCode();
    formNoti.value.customerCode = "";
    form.value.isLoading = false;
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error);
  }
}

//#endregion
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/category/customer/customer-form.css"
></style>
