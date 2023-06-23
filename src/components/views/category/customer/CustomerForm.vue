<template>
  <div class="wrapper wrapper--dark1 wrapper--form">
    <!-- Notibox -->
    <div class="form__wrapper" v-show="false"></div>
    <!-- Dialog -->
    <div class="form__wrapper" v-show="false"></div>
    <!-- Loader -->
    <div class="form__loader" v-show="false"></div>
    <div class="form">
      <div class="form__header">
        <div class="header__left">Thêm mới khách hàng</div>
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
              v-model:radioValue="cusType"
            />
          </div>
          <div class="hm__right">
            <div
              class="checkbox mi mi-18"
              :class="[isProvider ? 'mi-checkbox-checked' : '']"
              @click="isProvider = !isProvider"
            ></div>
            <div class="checkbox__label">Là nhà cung cấp</div>
          </div>
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
          <div class="fu__left">
            <div
              class="fu__left__top"
              :style="{ flexDirection: cusType == 1 ? 'row-reverse' : '' }"
            >
              <div class="fu__taxCode">
                <BaseTextfield
                  pholder=""
                  label="Mã số thuế"
                  :isrequired="false"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                />
              </div>
              <div class="fu__code">
                <BaseTextfield
                  pholder=""
                  label="Mã khách hàng"
                  :isrequired="true"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                />
              </div>
            </div>
            <div class="fu__left__mid m-top-24" v-show="cusType == 0">
              <div class="fu__name">
                <BaseTextfield
                  pholder=""
                  label="Tên khách hàng"
                  :isrequired="true"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                />
              </div>
            </div>
            <div class="fu__left__mid m-top-24" v-show="cusType == 1">
              <div class="fu__name_xungho">
                <BaseCombobox
                  label="Tên khách hàng"
                  pholder="Xưng hô"
                  :isrequired="false"
                  :option-list="[]"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                  v-model:selectedItemId="formNoti.customerCode"
                />
              </div>
              <div class="fu__name_real">
                <BaseTextfield
                  pholder="Họ và tên"
                  label=""
                  :isrequired="false"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                />
              </div>
            </div>
            <div class="fu__left__bot m-top-24">
              <div class="fu__address">
                <BaseTextfield
                  pholder=""
                  label="Địa chỉ"
                  :isrequired="false"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                />
              </div>
            </div>
          </div>
          <div class="fu__right">
            <div class="fu__right__top m-bot-24" v-show="cusType == 0">
              <div class="fu__phone">
                <BaseTextfield
                  pholder=""
                  label="Điện thoại"
                  :isrequired="false"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                />
              </div>
              <div class="fu__website">
                <BaseTextfield
                  pholder=""
                  label="Website"
                  :isrequired="false"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                />
              </div>
            </div>
            <div class="fu__right__mid m-bot-24">
              <BaseComboboxMultiSelect />
            </div>
            <div class="fu__right__bot">
              <BaseCombobox
                label="Nhân viên bán hàng"
                :isrequired="false"
                :option-list="[]"
                v-model:text="customer.customerCode"
                v-model:noti="formNoti.customerCode"
                v-model:selectedItemId="formNoti.customerCode"
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
                <div class="custype--org" v-show="cusType == 0">
                  <div class="mileft__top">
                    <div class="mileft__call">
                      <BaseCombobox
                        label="Người liên hệ"
                        pholder="Xưng hô"
                        :isrequired="false"
                        :option-list="[]"
                        v-model:text="customer.customerCode"
                        v-model:noti="formNoti.customerCode"
                        v-model:selectedItemId="formNoti.customerCode"
                      />
                    </div>
                    <div class="mileft__name">
                      <BaseTextfield
                        pholder="Họ và tên"
                        label=""
                        :isrequired="false"
                        v-model:text="customer.customerCode"
                        v-model:noti="formNoti.customerCode"
                      />
                    </div>
                  </div>
                  <div class="mileft__mid m-top-6">
                    <BaseTextfield
                      pholder="Email"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.customerCode"
                      v-model:noti="formNoti.customerCode"
                    />
                  </div>
                  <div class="mileft__bot m-top-6">
                    <BaseTextfield
                      pholder="Số điện thoại"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.customerCode"
                      v-model:noti="formNoti.customerCode"
                    />
                  </div>
                </div>
                <div class="custype--per" v-show="cusType == 1">
                  <BaseTextfield
                    pholder="Email"
                    label="Thông tin liên hệ"
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                  <BaseTextfield
                    class="m-top-6"
                    pholder="Điện thoại di động"
                    label=""
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                  <BaseTextfield
                    class="m-top-6"
                    pholder="Điện thoại cố định"
                    label=""
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                </div>
                <div class="mileft__last m-top-12">
                  <BaseTextfield
                    pholder="Đại diện theo PL"
                    label="Đại diện theo PL"
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                </div>
              </div>
              <div class="main__info__right">
                <div class="miright--org" v-show="cusType == 0">
                  <div class="miright__top">
                    <BaseTextfield
                      pholder="Họ và tên"
                      label="Người nhận hóa đơn điện tử"
                      :isrequired="false"
                      v-model:text="customer.customerCode"
                      v-model:noti="formNoti.customerCode"
                    />
                  </div>
                  <div class="miright__mid m-top-6">
                    <BaseTextfield
                      pholder="Email (Ngăn cách nhiều email bởi dấu chấm phẩy ';')"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.customerCode"
                      v-model:noti="formNoti.customerCode"
                    />
                  </div>
                  <div class="miright__bot m-top-6">
                    <BaseTextfield
                      pholder="Số điện thoại"
                      label=""
                      :isrequired="false"
                      v-model:text="customer.customerCode"
                      v-model:noti="formNoti.customerCode"
                    />
                  </div>
                </div>
                <div class="miright--per" v-show="cusType == 1">
                  <BaseTextfield
                    pholder="Số CMND/Thẻ căn cước"
                    label="Thông tin CMND/Thẻ căn cước"
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                  <BaseDatepicker
                    pholder="Ngày cấp"
                    class="m-top-6"
                    label=""
                    v-model:inputText="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                  <BaseTextfield
                    class="m-top-6"
                    pholder="Nơi cấp"
                    label=""
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                </div>
              </div>
            </div>
            <div class="main__panel main__purchase" v-show="selectedTabId == 1">
              <div class="mp__top">
                <div class="mp__top__left">
                  <BaseCombobox
                    label="Điều khoản thanh toán"
                    pholder=""
                    :isrequired="false"
                    :option-list="[]"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                    v-model:selectedItemId="formNoti.customerCode"
                  />
                </div>
                <div class="mp__top__mid">
                  <BaseTextfield
                    pholder=""
                    label="Số ngày được nợ"
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                </div>
                <div class="mp__top__right">
                  <BaseTextfield
                    pholder=""
                    label="Số nợ tối đa"
                    :isrequired="false"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                  />
                </div>
              </div>
              <div class="mp__mid m-top-12">
                <BaseCombobox
                  label="Tài khoản công nợ phải thu"
                  pholder=""
                  :isrequired="false"
                  :option-list="[]"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                  v-model:selectedItemId="formNoti.customerCode"
                />
                <BaseCombobox
                  v-show="isProvider"
                  label="Tài khoản công nợ phải trả"
                  pholder=""
                  :isrequired="false"
                  :option-list="[]"
                  v-model:text="customer.customerCode"
                  v-model:noti="formNoti.customerCode"
                  v-model:selectedItemId="formNoti.customerCode"
                />
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
                      v-for="(bankAcc, index) in customerBankAccList"
                      :key="bankAcc.bankAccount"
                    >
                      <td>
                        <div class="td__wrapper">
                          <input type="text" :value="bankAcc.bankAccount" />
                        </div>
                      </td>
                      <td>
                        <div class="td__wrapper">
                          <input type="text" :value="bankAcc.bankName" />
                        </div>
                      </td>
                      <td>
                        <div class="td__wrapper">
                          <input type="text" :value="bankAcc.bankBranch" />
                        </div>
                      </td>
                      <td>
                        <div class="td__wrapper">
                          <input type="text" :value="bankAcc.bankProvince" />
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
            <div class="main__panel main__oaddress" v-show="selectedTabId == 3">
              <div class="oad__left">
                <div class="oad__left__top">
                  <BaseCombobox
                    label="Vị trí địa lý"
                    pholder="Quốc gia"
                    :isrequired="false"
                    :option-list="[]"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                    v-model:selectedItemId="formNoti.customerCode"
                  />

                  <BaseCombobox
                    label=""
                    pholder="Tỉnh/Thành phố"
                    :isrequired="false"
                    :option-list="[]"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                    v-model:selectedItemId="formNoti.customerCode"
                  />
                </div>
                <div class="oad__left__bot m-top-6">
                  <BaseCombobox
                    label=""
                    pholder="Quận/Huyện"
                    :isrequired="false"
                    :option-list="[]"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                    v-model:selectedItemId="formNoti.customerCode"
                  />

                  <BaseCombobox
                    label=""
                    pholder="Xã/Phường"
                    :isrequired="false"
                    :option-list="[]"
                    v-model:text="customer.customerCode"
                    v-model:noti="formNoti.customerCode"
                    v-model:selectedItemId="formNoti.customerCode"
                  />
                </div>
              </div>
              <div class="oad__right">
                <div class="oad__right__title">
                  <div class="title__text">Địa chỉ giao hàng</div>
                  <div class="title__checkbox">
                    <div
                      class="checkbox mi mi-18"
                      :class="[true ? 'mi-checkbox-checked' : '']"
                    ></div>
                    <div class="checkbox__label">Giống địa chỉ khách hàng</div>
                  </div>
                </div>
                <div class="oad__right__table m-top-6">
                  <table class="oad__table">
                    <tbody>
                      <tr
                        v-for="(item, index) in customerShippingAddressList"
                        :key="item.id"
                      >
                        <td>
                          <div class="address__input">
                            <input type="text" :value="item.address" />
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
                  <BaseButton bname="Xóa hết dòng" class="btn--secondary" />
                </div>
              </div>
            </div>
            <div class="main__panel main__note" v-show="selectedTabId == 4">
              <div class="text__area">
                <div class="text__area__label">Ghi chú</div>
                <textarea name="" id="" cols="100" rows="10"></textarea>
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
          <BaseButton bname="Cất" class="btn--secondary" />
          <BaseButton bname="Cất và Thêm" class="btn--primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseRadiogroup from "../../../../components/base/BaseRadiogroup";
import BaseTextfield from "../../../../components/base/BaseTextfield";
import BaseCombobox from "../../../../components/base/BaseCombobox.vue";
import BaseComboboxMultiSelect from "@/components/base/BaseComboboxMultiSelect.vue";
import BaseDatepicker from "@/components/base/BaseDatepicker.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const cusType = ref(0);
const isProvider = ref(false);
const customer = ref({
  customerCode: "",
});
const formNoti = ref({
  showNotibox: false,
  notiboxType: "",
  notiboxMessage: "",
  customerCode: "",
});
const customerBankAccList = ref([
  {
    bankAccount: "123",
    bankName: "BIDV",
    bankBranch: "Cau giay",
    bankProvince: "Hanoi",
  },
  {
    bankAccount: "1234",
    bankName: "BIDV",
    bankBranch: "Cau giay",
    bankProvince: "Hanoi",
  },
]);

const customerShippingAddressList = ref([
  {
    id: 0,
    address: "144 Xuan Thuy",
  },
  {
    id: 1,
    address: "10 Ho Tung Mau",
  },
]);
const selectedTabId = ref(3);
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

function closeBtnOnClick() {
  router.replace("/DI/DICustomer");
}

function tabInfoOnClick(tabId) {
  selectedTabId.value = tabId;
}

function bankAccAddOnClick() {
  customerBankAccList.value.push({
    bankAccount: "",
    bankName: "",
    bankBranch: "",
    bankProvince: "",
  });
}

function customerBankAccDeleteOnClick(index) {
  customerBankAccList.value.splice(index, 1);
}

function osAddressBtnAddOnClick() {
  customerShippingAddressList.value.push({
    id: customerShippingAddressList.value.length + 1,
    address: "",
  });
}

function osAddressBtnDeleteOnClick(index) {
  customerShippingAddressList.value.splice(index, 1);
}
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/category/customer/customer-form.css"
></style>
