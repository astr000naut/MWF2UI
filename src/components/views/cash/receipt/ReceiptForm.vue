<template>
  <div class="wrapper wrapper--dark1 wrapper--form">
    <div class="form__wrapper" v-show="false">
      <!-- <BaseNotibox
        :type="formNoti.notiboxType"
        :message="formNoti.notiboxMessage"
        :yes-on-click="formNotiboxYesBtnOnClick"
        ref="notiRef"
      /> -->
    </div>
    <div class="form__wrapper" v-show="false">
      <!-- <BaseDialog
        :title="lang.dialog.savingChanges.title"
        :message="lang.dialog.savingChanges.message"
        :close-on-click="formDialogCloseBtnOnClick"
        :no-on-click="formDialogNoBtnOnClick"
        :yes-on-click="formDialogYesBtnOnClick"
        ref="dialogRef"
      /> -->
    </div>
    <div class="form__loader" v-show="false">
      <!-- <BaseLoader /> -->
    </div>
    <div class="form">
      <div class="form__header">
        <div class="header__left">
          <div class="left__icon mi mi-24 mi-recent-log"></div>
          <div class="left__title">Phiếu thu PT00016</div>
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
          <BaseButton bname="" class="mi-36 btn--setting" />
          <BaseButton bname="" class="mi-36 btn--help" />
          <BaseButton
            bname=""
            class="mi-36 btn--close"
            @click="btnCloseOnClick"
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
                  <div class="mi mi-24 mi--lookup"></div>
                </div>
              </div>
              <div class="tl__row">
                <BaseTextfield
                  pholder=""
                  label="Người nộp"
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
                <div class="ref__text">Tham chiếu</div>
                <div class="ref__btn">...</div>
              </div>
            </div>
            <div class="tl__right fl2">
              <div class="tl__row">
                <BaseTextfield
                  pholder=""
                  label="Tên khách hàng"
                  :isrequired="false"
                  v-model:text="receipt.customerName"
                  noti=""
                />
              </div>
              <div class="tl__row">
                <BaseTextfield
                  pholder=""
                  label="Địa chỉ"
                  :isrequired="false"
                  v-model:text="receipt.customerAddress"
                  noti=""
                />
              </div>
              <div class="tl__row fl cg12">
                <div class="receipt__reason fl2">
                  <BaseTextfield
                    pholder=""
                    label="Lý do nộp"
                    :isrequired="false"
                    v-model:text="receipt.reason"
                    noti=""
                  />
                </div>
                <div class="document-included fl1">
                  <BaseTextfield
                    pholder="Số lượng"
                    label="Kèm theo"
                    :isrequired="false"
                    :textRight="true"
                    text=""
                    noti=""
                  />
                </div>
                <div class="tl__textbox">
                  <div class="tl__text">chứng từ gốc</div>
                </div>
              </div>
            </div>
          </div>
          <div class="btop__right fl fl1">
            <div class="tr__left">
              <div class="tr__row">
                <BaseDatepicker
                  pholder=""
                  label="Ngày hạch toán"
                  v-model:inputText="receipt.postedDate"
                  noti=""
                />
              </div>
              <div class="tr__row">
                <BaseDatepicker
                  pholder=""
                  label="Ngày phiếu thu"
                  v-model:inputText="receipt.receiptDate"
                  noti=""
                />
              </div>
              <BaseTextfield
                pholder=""
                label="Số phiếu thu"
                :isrequired="false"
                text=""
                noti=""
              />
            </div>
            <div class="tr__right">
              <div class="trr__label">Tổng tiền</div>
              <div class="trr__amount">0</div>
            </div>
          </div>
        </div>
        <div class="body__bot">
          <div class="bot__table">
            <div class="table__title">Hạch toán</div>
            <div class="table__container">
              <table class="rdetail__table">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 50px">#</th>
                    <th
                      v-for="header in detailTableStructure"
                      :key="header.prop"
                      :style="{
                        width: header.width != 0 ? header.width + 'px' : 'auto',
                      }"
                    >
                      <div :class="header.align">
                        {{ header.name }}
                      </div>
                    </th>
                    <th style="width: 50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="index in receiptDetails"
                    :key="index"
                    ref="receiptDetailRefs"
                  >
                    <td class="text-center">{{ index }}</td>
                    <td>
                      <div class="td__wrapper">
                        <input class="rdetail--input" type="text" value="" />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <FormAccountCombobox
                          :style="{
                            'z-index': 5 - index + 1,
                          }"
                          selectedItemId=""
                          selectedItemName=""
                        />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <FormAccountCombobox
                          :style="{
                            'z-index': 5 - index + 1,
                          }"
                          selectedItemId=""
                          selectedItemName=""
                        />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <input class="rdetail--input" type="text" value="" />
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
            <div class="table__summary">
              <div class="total__money">0</div>
            </div>
            <div class="table__control">
              <BaseButton
                bname="Thêm dòng"
                class="btn--secondary"
                @click="bankAccAddOnClick"
              />
              <BaseButton bname="Xóa hết dòng" class="btn--secondary" />
            </div>
          </div>
          <div class="bot__upload">
            <div class="upload__top">
              <div class="upload__icon mi mi-18 mi-attach"></div>
              <div class="upload__title">Đính kèm</div>
              <div class="upload__label">Dung lượng tối đa 5MB</div>
            </div>
            <div class="upload__bot">
              <div class="upload__text">
                Kéo/thả tệp vào đây hoặc bấm vào đây
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
          <BaseButton bname="Cất" class="btn--secondary" />
          <BaseButton bname="Cất và Thêm" class="btn--primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import BaseSelectbox from "@/components/base/BaseSelectbox.vue";
import EmployeeCombobox from "../../category/customer/EmployeeCombobox.vue";
import CustomerCombobox from "./CustomerCombobox.vue";
import BaseTextfield from "@/components/base/BaseTextfield.vue";
import BaseDatepicker from "@/components/base/BaseDatepicker.vue";
import FormAccountCombobox from "./FormAccountCombobox.vue";
import { ref, watch, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Receipt } from "@/js/model/receipt";
import $enum from "@/js/common/enum";
const $axios = inject("$axios");
import $api from "@/js/api";
const formTypeList = [
  "1. Thu tiền khách hàng (không theo hóa đơn)",
  "2. Thu hoàn ứng nhân viên",
  "3. Rút tiền gửi về nhập quỹ",
  "4. Thu khác",
];
const formTypeId = ref(0);
const router = useRouter();
const route = useRoute();
const receipt = ref({});
const form = ref({});
const receiptDetails = ref(1);
const detailTableStructure = [
  {
    name: "Diễn giải",
    prop: "description",
    align: "text-left",
    width: 0,
  },
  {
    name: "TK nợ",
    prop: "description",
    align: "text-left",
    width: 300,
  },
  {
    name: "TK có",
    prop: "description",
    align: "text-left",
    width: 300,
  },
  {
    name: "Số tiền",
    prop: "description",
    align: "text-left",
    width: 300,
  },
];

const employeeComboboxTableStructure = [
  {
    name: "Mã nhân viên",
    prop: "employeeCode",
    align: "text-left",
    width: 160,
  },
  {
    name: "Tên nhân viên",
    prop: "employeeFullName",
    align: "text-left",
    width: 200,
  },
  {
    name: "Đơn vị",
    prop: "departmentName",
    align: "text-left",
    width: 210,
  },
  {
    name: "ĐT di động",
    prop: "phoneNumber",
    align: "text-left",
    width: 180,
  },
];

resetFormState();

onMounted(async () => {
  watch(
    () => receipt.value.customerId,
    () => {
      receipt.value.reason = "Thu tiền của " + receipt.value.customerName;
    }
  );
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

function resetFormState() {
  form.value = {
    type: route.params.id ? "info" : "create",
    entityId: route.params.id ?? "",
    isLoading: false,
  };
  receipt.value = new Receipt({});
}

async function fetchEntityToEntityObject(entityId) {
  const response = await $axios.get($api.receipt.one(entityId));
  const entityFromApi = response.data;
  receipt.value = new Receipt(entityFromApi);
}

async function getDataFromApi() {
  if (form.value.type == $enum.form.infoType) {
    await fetchEntityToEntityObject(form.value.entityId);
    // const oldAcc = new Account({});
    // oldAcc.cloneFromOtherAccount(account.value);
    // oldAccount = oldAcc;
    return;
  }
}

function btnCloseOnClick() {
  router.replace("/CA/CAReceipt");
}

function bankAccAddOnClick() {
  receiptDetails.value += 1;
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
