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
      <BaseLoader />
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
                    selectedEmployeeId=""
                    selectedEmployeeName=""
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
                  text=""
                  noti=""
                />
              </div>
              <div class="tl__row">
                <div class="emp__combobox fl1">
                  <EmployeeCombobox
                    selectedEmployeeId=""
                    selectedEmployeeName=""
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
                  text=""
                  noti=""
                />
              </div>
              <div class="tl__row">
                <BaseTextfield
                  pholder=""
                  label="Địa chỉ"
                  :isrequired="false"
                  text=""
                  noti=""
                />
              </div>
              <div class="tl__row fl cg12">
                <BaseTextfield
                  pholder=""
                  label="Lý do nộp"
                  :isrequired="false"
                  text=""
                  noti=""
                />
                <BaseTextfield
                  pholder=""
                  label="Kèm theo"
                  :isrequired="false"
                  text=""
                  noti=""
                />
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
                  inputText=""
                  noti=""
                />
              </div>
              <div class="tr__row">
                <BaseDatepicker
                  pholder=""
                  label="Ngày phiếu thu"
                  inputText=""
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
              <div class="trr__amount">9999999999999999</div>
            </div>
          </div>
        </div>
        <div class="body__bot">
          <div class="bot__table">
            <div class="table__title">Hạch toán</div>
            <div class="table__container">
              <table class="bankacc__table">
                <thead>
                  <tr>
                    <th class="text-center">#</th>
                    <th>
                      <div class="text-left">Diễn giải</div>
                    </th>
                    <th>
                      <div class="text-left">TK Nợ</div>
                    </th>
                    <th>
                      <div class="text-left">TK Có</div>
                    </th>
                    <th>
                      <div class="text-left">Đối tượng</div>
                    </th>
                    <th>
                      <div class="text-left">Tên đối tượng</div>
                    </th>
                    <th>
                      <div class="text-right">Số tiền</div>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="index in 5" :key="index" ref="receiptDetailRefs">
                    <td class="text-center">{{ index }}</td>
                    <td>
                      <div class="td__wrapper">
                        <input type="text" value="" />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <input type="text" value="" />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <input type="text" value="" />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <input type="text" value="" />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <input type="text" value="" />
                      </div>
                    </td>
                    <td>
                      <div class="td__wrapper">
                        <input type="text" value="" />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
const formTypeList = [
  "1. Thu tiền khách hàng (không theo hóa đơn)",
  "2. Thu hoàn ứng nhân viên",
  "3. Rút tiền gửi về nhập quỹ",
  "4. Thu khác",
];
const formTypeId = ref(0);
const router = useRouter();

function btnCloseOnClick() {
  router.replace("/CA/CAReceipt");
}
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/cash/receipt/receipt-form.css"
></style>
