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
    <div class="form" ref="formRef">
      <div class="form__header">
        <div class="header__left">
          <div class="left__icon mi mi-24 mi-recent-log"></div>
          <div class="left__title">
            {{ lang.cash_receipt.form.title }} {{ receipt.receiptNo }}
          </div>
          <div class="left__select">
            <BaseSelectbox
              style="width: 390px"
              :isActive="true"
              label=""
              pholder=""
              :isrequired="false"
              :option-list="formTypeList"
              noti=""
              v-model:selectedItemId="formTypeId"
            />
          </div>
        </div>
        <div class="header__right">
          <BaseButton
            bname=""
            class="mi-36 btn--setting"
            v-tooltip="lang.cash_receipt.tooltip.customDisplay"
          />
          <BaseButton
            bname=""
            class="mi-36 btn--help"
            v-tooltip="lang.cash_receipt.tooltip.help"
          />
          <BaseButton
            bname=""
            class="mi-36 btn--close"
            @click="btnCloseOnClick"
            v-tooltip="lang.cash_receipt.tooltip.close"
          />
        </div>
      </div>
      <div class="form__body">
        <div class="body__top fl">
          <div class="btop__left fl fl2 cg18">
            <div class="tl__left fl1">
              <div class="tl__row cg12">
                <div class="cus__combobox fl1">
                  <CustomerCombobox
                    v-model:selectedEntityId="receipt.customerId"
                    v-model:selectedEntityCode="receipt.customerCode"
                    v-model:selectedEntityName="receipt.customerName"
                    v-model:selectedEntityContact="receipt.contactName"
                    v-model:selectedEntityAddress="receipt.customerAddress"
                  />
                </div>
                <div class="lookup__btn">
                  <div
                    class="mi mi-24 mi--lookup"
                    v-tooltip="lang.cash_receipt.tooltip.watchDebt"
                  ></div>
                </div>
              </div>
              <div class="tl__row">
                <BaseTextfield
                  pholder=""
                  :label="lang.cash_receipt.label.contactName"
                  :isrequired="false"
                  v-model:text="receipt.contactName"
                  noti=""
                />
              </div>
              <div class="tl__row">
                <div class="emp__combobox fl1">
                  <EmployeeCombobox
                    v-model:selectedEmployeeId="receipt.employeeId"
                    v-model:selectedEmployeeName="receipt.employeeName"
                    :table-structure="employeeComboboxTableStructure"
                  />
                </div>
              </div>
              <div class="tl__row">
                <div class="ref__text">
                  {{ lang.cash_receipt.text.reference }}
                </div>
                <div class="ref__btn">...</div>
              </div>
            </div>
            <div class="tl__right fl2">
              <div class="tl__row">
                <BaseTextfield
                  pholder=""
                  :label="lang.cash_receipt.label.customerName"
                  :isrequired="false"
                  v-model:text="receipt.customerName"
                  noti=""
                />
              </div>
              <div class="tl__row">
                <BaseTextfield
                  pholder=""
                  :label="lang.cash_receipt.label.address"
                  :isrequired="false"
                  v-model:text="receipt.customerAddress"
                  noti=""
                />
              </div>
              <div class="tl__row fl cg12">
                <div class="receipt__reason fl2">
                  <BaseTextfield
                    pholder=""
                    :label="lang.cash_receipt.label.reason"
                    :isrequired="false"
                    v-model:text="receipt.reason"
                    noti=""
                  />
                </div>
                <div class="document-included fl1">
                  <BaseTextfield
                    :pholder="lang.cash_receipt.text.amount"
                    :label="lang.cash_receipt.label.documentIncluded"
                    :isrequired="false"
                    :textRight="true"
                    v-model:text="receipt.documentIncluded"
                    noti=""
                  />
                </div>
                <div class="tl__textbox">
                  <div class="tl__text">
                    {{ lang.cash_receipt.text.originalDoc }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btop__right fl fl1">
            <div class="tr__left">
              <div class="tr__row">
                <BaseDatepicker
                  pholder=""
                  :label="lang.cash_receipt.label.postedDate"
                  v-model:inputText="receipt.postedDate"
                  v-model:noti="formNoti.postedDate"
                  ref="postedDateRef"
                />
              </div>
              <div class="tr__row">
                <BaseDatepicker
                  pholder=""
                  :label="lang.cash_receipt.label.receiptDate"
                  v-model:inputText="receipt.receiptDate"
                  v-model:noti="formNoti.receiptDate"
                  ref="receiptDateRef"
                />
              </div>
              <BaseTextfield
                pholder=""
                :label="lang.cash_receipt.label.receiptNo"
                :autoFillMessage="lang.cash_receipt.message.autoGenReceiptNo"
                :autoFill="generateReceiptNo"
                :isrequired="true"
                v-model:text="receipt.receiptNo"
                v-model:noti="formNoti.receiptNo"
                ref="receiptNoRef"
              />
            </div>
            <div class="tr__right">
              <div class="trr__label">
                {{ lang.cash_receipt.label.totalAmount }}
              </div>
              <div class="trr__amount">
                {{ numberFormater.format(receipt.totalAmount) }}
              </div>
            </div>
          </div>
        </div>
        <div class="body__bot">
          <div class="bot__table">
            <div class="table__title">{{ lang.cash_receipt.text.posted }}</div>
            <div class="table__container">
              <table class="rdetail__table">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 50px">#</th>
                    <th
                      v-for="header in detailTableStructure"
                      :key="header.name"
                      :style="{
                        width: header.width != 0 ? header.width + 'px' : 'auto',
                      }"
                    >
                      <div :class="header.align" v-tooltip="header.tooltip">
                        {{ header.name }}
                      </div>
                    </th>
                    <th style="width: 50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(rdetail, index) in receiptDetailsDisplay"
                    :key="rdetail.receiptId"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>
                      <div class="td__wrapper">
                        <input
                          class="rdetail--input"
                          type="text"
                          v-model="rdetail.description"
                          ref="rdetailDescriptionInputRefs"
                        />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <FormAccountCombobox
                          :style="{
                            'z-index': 30 - index + 1,
                          }"
                          v-model:selectedItemId="rdetail.debitAccountId"
                          v-model:selectedItemName="rdetail.debitAccountNumber"
                          ref="debitAccountRefs"
                        />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <FormAccountCombobox
                          :style="{
                            'z-index': 20 - index + 1,
                          }"
                          v-model:selectedItemId="rdetail.creditAccountId"
                          v-model:selectedItemName="rdetail.creditAccountNumber"
                          ref="creditAccountRefs"
                        />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <div class="p-left-10">{{ receipt.customerCode }}</div>
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <div class="p-left-10">{{ receipt.customerName }}</div>
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <input
                          class="rdetail--input text-right"
                          type="text"
                          maxlength="18"
                          v-model="rdetail.amount"
                          @input="rdetailAmountOnInput($event, rdetail)"
                        />
                      </div>
                    </td>
                    <td>
                      <div
                        class="delete__button"
                        @click="
                          softDeleteReceiptDetail(rdetail.receiptDetailId)
                        "
                      >
                        <div class="delete__icon mi mi-16 mi-delete"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table__summary">
              <div class="total__money">
                {{ numberFormater.format(receipt.totalAmount) }}
              </div>
            </div>
            <div class="table__control">
              <BaseButton
                :bname="lang.button.addLine"
                class="btn--secondary"
                @click="receiptDetailAddOnClick"
              />
              <BaseButton
                :bname="lang.button.deleteAllLine"
                class="btn--secondary"
                @click="softDeleteAllReceiptDetailOnClick"
              />
            </div>
          </div>
          <div class="bot__upload">
            <div class="upload__top">
              <div class="upload__icon mi mi-18 mi-attach"></div>
              <div class="upload__title">
                {{ lang.cash_receipt.text.attach }}
              </div>
              <div class="upload__label">
                {{ lang.cash_receipt.text.maxCapacity }}
              </div>
            </div>
            <div class="upload__bot">
              <div class="upload__text">
                {{ lang.cash_receipt.text.attachMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form__footer">
        <div class="footer__left">
          <BaseButton bname="Hủy" class="btn--secondary" />
        </div>
        <div class="footer__right">
          <BaseButton
            :bname="lang.cash_receipt.button.save"
            class="btn--secondary"
            @click="btnSaveOnClick"
            v-tooltip:top="'Cất (Ctrl + S)'"
          />
          <BaseButton
            :bname="lang.cash_receipt.button.saveAndAdd"
            class="btn--primary"
            v-tooltip:top="'Cất và thêm (Ctrl + Shift + S)'"
            @click="btnSaveAndAddOnClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EmployeeCombobox from "../../category/customer/EmployeeCombobox.vue";
import CustomerCombobox from "./CustomerCombobox.vue";
import FormAccountCombobox from "./FormAccountCombobox.vue";
import { ref, watch, onMounted, inject, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Receipt } from "@/js/model/receipt";
import $enum from "@/js/common/enum";
import $formatter from "../../../../js/common/formater";
import $api from "@/js/api";
import { ReceiptDetail } from "../../../../js/model/receipt-detail";
import numberFormater from "@/js/common/number-formater";

const emits = defineEmits(["updateEntityList", "update:metadata"]);
const $axios = inject("$axios");
const lang = inject("$lang");
const _ = require("lodash");
var firstErrorRef = null;
const notiRef = ref(null);
const receiptNoRef = ref(null);
const formRef = ref(null);

const formTypeList = lang.cash_receipt.formType;
const formTypeId = ref(0);
const router = useRouter();
const route = useRoute();
const receipt = ref({});
const form = ref({});
const receiptDetails = ref([]);
const oldReceiptDetails = ref([]);
const rdetailDescriptionInputRefs = ref([]);
var oldReceipt;
const debitAccountRefs = ref([]);
const creditAccountRefs = ref([]);
const detailTableStructure = [
  {
    name: lang.cash_receipt.detailTable.description.text,
    prop: "",
    align: "text-left",
    width: 0,
    tooltip: lang.cash_receipt.detailTable.description.tooltip,
  },
  {
    name: lang.cash_receipt.detailTable.debitAccount.text,
    prop: "",
    align: "text-left",
    width: 200,
    tooltip: lang.cash_receipt.detailTable.debitAccount.tooltip,
  },
  {
    name: lang.cash_receipt.detailTable.creditAccount.text,
    prop: "",
    align: "text-left",
    width: 200,
    tooltip: lang.cash_receipt.detailTable.creditAccount.tooltip,
  },
  {
    name: lang.cash_receipt.detailTable.object.text,
    prop: "",
    align: "text-left",
    width: 300,
    tooltip: lang.cash_receipt.detailTable.object.tooltip,
  },
  {
    name: lang.cash_receipt.detailTable.objectName.text,
    prop: "",
    align: "text-left",
    width: 300,
    tooltip: lang.cash_receipt.detailTable.objectName.tooltip,
  },
  {
    name: lang.cash_receipt.detailTable.amount.text,
    prop: "",
    align: "text-right",
    width: 200,
    tooltip: lang.cash_receipt.detailTable.amount.tooltip,
  },
];

const formDialog = ref({
  isShow: false,
});
const dialogRef = ref(null);

const employeeComboboxTableStructure = [
  {
    name: lang.cash_receipt.employeeComboboxTable.employeeCode,
    prop: "employeeCode",
    align: "text-left",
    width: 160,
  },
  {
    name: lang.cash_receipt.employeeComboboxTable.employeeFullName,
    prop: "employeeFullName",
    align: "text-left",
    width: 200,
  },
  {
    name: lang.cash_receipt.employeeComboboxTable.departmentName,
    prop: "departmentName",
    align: "text-left",
    width: 210,
  },
  {
    name: lang.cash_receipt.employeeComboboxTable.phoneNumber,
    prop: "phoneNumber",
    align: "text-left",
    width: 180,
  },
];

const formNoti = ref({
  showNotibox: false,
  notiboxType: "",
  notiboxMessage: "",

  receiptNo: "",
  postedDate: "",
  receiptDate: "",
});
const postedDateRef = ref(null);
const receiptDateRef = ref(null);

const receiptDetailsDisplay = computed(() => {
  return receiptDetails.value.filter((rdetail) => rdetail.status != "delete");
});

resetFormState();

watch(receiptDetails.value, () => {
  receipt.value.totalAmount = 0;
  for (const rd of receiptDetails.value) {
    if (rd.status != "delete")
      receipt.value.totalAmount += numberFormater.getNumber(rd.amount);
  }
});

onMounted(async () => {
  try {
    // Nếu form là kiểu thông tin account mà id của router không hợp lệ thì quay lại
    if (
      form.value.type == $enum.form.infoType &&
      !isUUID(form.value.entityId)
    ) {
      await router.replace("/CA/CAReceipt");
      return;
    }

    form.value.isLoading = true;

    // Lấy dữ liệu từ Server
    await getDataFromApi();
    form.value.isLoading = false;
  } catch (error) {
    form.value.isLoading = false;
    console.log(error);
  }
});

watch(
  () => receipt.value.customerId,
  (newId, oldId) => {
    if (newId != "" && (oldId != "" || form.value.type == "create"))
      receipt.value.reason = "Thu tiền của " + receipt.value.customerName;
  }
);

watch(
  () => receipt.value.reason,
  (newReason, oldReason) => {
    for (const rd of receiptDetails.value) {
      if (rd.description == oldReason) {
        rd.description = newReason;
      }
    }
  }
);

watch(
  () => receipt.value.postedDate,
  (newDate, oldDate) => {
    if (
      receipt.value.receiptDate == "" ||
      receipt.value.receiptDate == oldDate
    ) {
      receipt.value.receiptDate = newDate;
    }
    formNoti.value.postedDate = "";
    formNoti.value.receiptDate = "";
  }
);

watch(
  () => receipt.value.receiptDate,
  () => {
    if (receipt.value.postedDate != "") formNoti.value.postedDate = "";
    formNoti.value.receiptDate = "";
  }
);

function resetFormState() {
  form.value = {
    type: route.params.id ? "info" : "create",
    entityId: route.params.id ?? "",
    isLoading: false,
  };
  receipt.value = new Receipt({});
  receiptDetails.value = [];
  receiptDetails.value.push(new ReceiptDetail({}));
}

async function fetchEntityToEntityObject(entityId) {
  const response = await $axios.get($api.receipt.one(entityId));
  const entityFromApi = response.data;
  receipt.value = new Receipt(entityFromApi);
  for (const rd of receipt.value.receiptDetailList) {
    receiptDetails.value.push(new ReceiptDetail(rd));
    oldReceiptDetails.value.push(new ReceiptDetail(rd));
  }
  oldReceipt = new Receipt(entityFromApi);
}

async function fetchNewReceiptNo() {
  const response = await $axios.get($api.receipt.newReceiptNo);
  receipt.value.receiptNo = response.data;
}

async function getDataFromApi() {
  if (form.value.type == $enum.form.infoType) {
    await fetchEntityToEntityObject(form.value.entityId);
  }
  if (form.value.type == $enum.form.createType) {
    await fetchNewReceiptNo();
  }

  if (receiptDetails.value.length == 0) {
    receiptDetails.value.push(new ReceiptDetail({}));
  }
}

function softDeleteReceiptDetail(id) {
  let i = 0;
  console.log(receiptDetails.value);
  while (i < receiptDetails.value.length) {
    if (receiptDetails.value[i].receiptDetailId == id) {
      if (receiptDetails.value[i].status != "create") {
        receiptDetails.value[i].status = "delete";
      } else {
        receiptDetails.value.splice(i, 1);
      }
      break;
    }
    ++i;
  }
  console.log(receiptDetails);
}

async function softDeleteAllReceiptDetailOnClick() {
  let i = 0;
  while (i < receiptDetails.value.length) {
    if (receiptDetails.value[i].status != "create") {
      receiptDetails.value[i].status = "delete";
      ++i;
    } else receiptDetails.value.splice(i, 1);
  }
  receiptDetails.value.push(new ReceiptDetail({}));
  await nextTick();
  focusOnLastDescriptionInput();
}

function updateReceiptDetailInfo() {
  for (let i = 0; i < receiptDetails.value.length; ++i) {
    if (receiptDetails.value[i].status == "view") {
      for (let j = 0; j < oldReceiptDetails.value.length; ++j) {
        if (
          oldReceiptDetails.value[j].receiptDetailId ==
            receiptDetails.value[i].receiptDetailId &&
          !_.isEqual(oldReceiptDetails.value[j], receiptDetails.value[i])
        ) {
          receiptDetails.value[i].status = "update";
          break;
        }
      }
    }
  }
}

async function btnSaveOnClick() {
  try {
    form.value.isLoading = true;
    await validateData();
    // Nếu có một lỗi nào đó sau khi validate
    if (formNoti.value.notiboxMessage.length) {
      form.value.isLoading = false;
      // show notibox
      await displayNotiBox();
    } else {
      // Nếu Validate thành công

      // Cập nhật lại thông tin trên bảng receipt Detail
      updateReceiptDetailInfo();
      // Gắn receipt detail list vào
      receipt.value.receiptDetailList = [];
      for (const rd of receiptDetails.value) {
        receipt.value.receiptDetailList.push(rd.convertToApiFormat());
      }

      // Nếu form là form cập nhật thông tin
      if (form.value.type == $enum.form.infoType) {
        // Gọi API sửa
        await callEditAPI();
        // Emit sự kiện cập nhật để cập nhật trên table
        console.log(receipt.value);
        emits("updateEntityList", "edit", receipt.value);
      } else {
        // Nếu form là form thêm mới hoặc nhân bản
        // Gọi API thêm mới
        const newId = await callCreateAPI();
        receipt.value.receiptId = newId;
        // Emit sự kiện thêm mới để cập nhật trên table
        emits("updateEntityList", "create", receipt.value);
      }

      form.value.isLoading = false;
      router.replace("/CA/CAReceipt");
    }
  } catch (error) {
    console.log(error);
    form.value.isLoading = false;
    await handleResponseStatusCode(error.response.status, error);
  }
}

async function btnSaveAndAddOnClick() {
  try {
    form.value.isLoading = true;
    await validateData();
    // Nếu có một lỗi nào đó sau khi validate
    if (formNoti.value.notiboxMessage.length) {
      form.value.isLoading = false;
      // show notibox
      await displayNotiBox();
    } else {
      // Nếu Validate thành công

      // Cập nhật lại thông tin trên bảng receipt Detail
      updateReceiptDetailInfo();
      // Gắn receipt detail list vào
      receipt.value.receiptDetailList = [];
      for (const rd of receiptDetails.value) {
        receipt.value.receiptDetailList.push(rd.convertToApiFormat());
      }

      // Nếu form là form cập nhật thông tin
      if (form.value.type == $enum.form.infoType) {
        // Gọi API sửa
        await callEditAPI();
        // Emit sự kiện cập nhật để cập nhật trên table
        console.log(receipt.value);
        emits("updateEntityList", "edit", receipt.value);
      } else {
        // Nếu form là form thêm mới hoặc nhân bản
        // Gọi API thêm mới
        const newId = await callCreateAPI();
        receipt.value.receiptId = newId;
        // Emit sự kiện thêm mới để cập nhật trên table
        emits("updateEntityList", "create", receipt.value);
      }

      form.value.isLoading = false;
      await router.replace("/CA/CAReceipt/create");

      resetFormState();

      await fetchNewReceiptNo();
    }
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error.response.status, error);
  }
}

async function validateData() {
  firstErrorRef = null;

  //validate số phiếu thu
  if (receipt.value.receiptNo == "") {
    formNoti.value.receiptNo = lang.cash_receipt.error.notEmpty(
      lang.cash_receipt.label.receiptNo
    );
    firstErrorRef = firstErrorRef ?? receiptNoRef;
  }

  // Validate receipt detail
  for (let i = 0; i < receiptDetailsDisplay.value.length; ++i) {
    if (receiptDetailsDisplay.value[i].debitAccountNumber == "") {
      debitAccountRefs.value[i].noti = lang.cash_receipt.error.notEmpty(
        lang.cash_receipt.label.debitAccount
      );
      firstErrorRef = firstErrorRef ?? debitAccountRefs.value[i];
    }
    if (receiptDetailsDisplay.value[i].creditAccountNumber == "") {
      creditAccountRefs.value[i].noti = lang.cash_receipt.error.notEmpty(
        lang.cash_receipt.label.creditAccount
      );
      firstErrorRef = firstErrorRef ?? creditAccountRefs.value[i];
    }
  }

  // Ngày hạch toán và ngày phiếu thu
  // Ngày hạch toán trống
  if (receipt.value.postedDate == "") {
    formNoti.value.postedDate = lang.cash_receipt.error.notEmpty(
      lang.cash_receipt.label.postedDate
    );
    firstErrorRef = firstErrorRef ?? postedDateRef;
  }
  // Ngày phiếu thu trống
  if (receipt.value.receiptDate == "") {
    formNoti.value.receiptDate = lang.cash_receipt.error.notEmpty(
      lang.cash_receipt.label.receiptDate
    );
    firstErrorRef = firstErrorRef ?? receiptDateRef;
  }
  // Ngày hạch toán nhỏ hơn ngày phiếu thu
  if (
    !$formatter.compareDate(receipt.value.receiptDate, receipt.value.postedDate)
  ) {
    formNoti.value.postedDate = lang.cash_receipt.error.dateMustAfter(
      lang.cash_receipt.label.postedDate,
      lang.cash_receipt.label.receiptDate
    );
    firstErrorRef = firstErrorRef ?? postedDateRef;
  }
  if (firstErrorRef != null) {
    // Update notibox value
    formNoti.value.notiboxType = "alert";
    formNoti.value.notiboxMessage = lang.cash_receipt.error.invalidInput;
  } else {
    formNoti.value.notiboxMessage = "";
  }
}

async function generateReceiptNo() {
  try {
    form.value.isLoading = true;
    await fetchNewReceiptNo();
    formNoti.value.receiptNo = "";
    form.value.isLoading = false;
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error.response.status, error);
  }
}

async function callEditAPI() {
  const requestBody = receipt.value.convertToApiFormat();
  // console.log(requestBody);
  await $axios.put($api.receipt.one(form.value.entityId), requestBody);
}

async function callCreateAPI() {
  const requestBody = receipt.value.convertToApiFormat();
  console.log(requestBody);
  const response = await $axios.post($api.receipt.index, requestBody);
  return response.data;
}

async function handleResponseStatusCode(code, error) {
  formNoti.value.notiboxType = "alert";
  if (code == 400) {
    // Trường hợp backend trả về BadRequest
    formNoti.value.notiboxMessage = lang.cash_receipt.error.invalidInput;
    await displayNotiBox();
  } else if (code == 404) {
    // Trường hợp không tìm thấy ID của nhân viên trên URL
    await router.replace("/DI/DIEmployee");
  } else {
    // Các trường hợp còn lại
    formNoti.value.notiboxMessage = error.response.data.UserMessage;
    await displayNotiBox();
  }
}

async function displayNotiBox() {
  formNoti.value.showNotibox = true;
  await nextTick();
  notiRef.value.yesBtn.refBtn.focus();
}

async function btnCloseOnClick() {
  if (
    _.isEqual(oldReceipt, receipt.value) &&
    _.isEqual(oldReceiptDetails.value, receiptDetails.value)
  ) {
    router.back();
  } else {
    formDialog.value.isShow = true;
    await nextTick();
    await dialogRef.value.yesBtn.refBtn.focus();
  }
}

function formNotiboxYesBtnOnClick() {
  formNoti.value.showNotibox = false;
  focusOnFirstErrorInput();
}

function focusOnLastDescriptionInput() {
  rdetailDescriptionInputRefs.value[
    rdetailDescriptionInputRefs.value.length - 1
  ].focus();
}

async function receiptDetailAddOnClick() {
  if (receiptDetails.value.length == 20) return;
  const rd = new ReceiptDetail({});
  if (receiptDetails.value.length) {
    rd.cloneFromOther(receiptDetails.value[receiptDetails.value.length - 1]);
  }
  receiptDetails.value.push(rd);
  await nextTick();
  focusOnLastDescriptionInput();
  if (receiptDetails.value.length > 3) {
    console.log("hi");
    formRef.value.scrollTo({ top: formRef.value.offsetHeight });
  }
}

async function formDialogCloseBtnOnClick() {
  formDialog.value.isShow = false;
  // Next tick để đợi đến khi formDialog được ẩn đi
  await nextTick();
  if (firstErrorRef != null) {
    focusOnFirstErrorInput();
  }
}

function formDialogNoBtnOnClick() {
  formDialog.value.isShow = false;
  router.back();
}

function rdetailAmountOnInput(_$event, rdetail) {
  rdetail.amount = numberFormater.format(
    _$event.target.value.replace(/[^\d]/g, "")
  );
}

function focusOnFirstErrorInput() {
  if (firstErrorRef.value) {
    firstErrorRef.value.refInput.focus();
  } else {
    firstErrorRef.refInput.focus();
  }
}

async function formDialogYesBtnOnClick() {
  formDialog.value.isShow = false;
  await btnSaveOnClick();
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
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/cash/receipt/receipt-form.css"
></style>
