<template>
  <div class="cash__process__container">
    <div class="cash__process__main">
      <div class="main__left">
        <div class="left__top">
          <div class="top__title">
            <div class="title__text">NGHIỆP VỤ TIỀN MẶT</div>
          </div>
          <div class="top__content">
            <div class="box__item receive__box" @click="receiveBoxOnClick">
              <div class="box__text">Thu tiền</div>
            </div>
            <div class="box__item payment__box">
              <div class="box__text">Chi tiền</div>
            </div>
            <div class="box__item audit__box">
              <div class="box__text">Kiểm kê quỹ</div>
            </div>
          </div>
        </div>
        <div class="left__bottom">
          <div class="bottom__item" @click="customerItemOnClick">
            <div class="item__content">
              <div class="item__icon minc mi-24 mi-process-customer"></div>
              <div class="item__text">Khách hàng</div>
            </div>
          </div>
          <div class="bottom__item">
            <div class="item__content">
              <div class="item__icon minc mi-24 mi-process-provider"></div>
              <div class="item__text">Nhà cung cấp</div>
            </div>
          </div>
          <div class="bottom__item" @click="employeeItemOnClick">
            <div class="item__content">
              <div class="item__icon minc mi-24 mi-process-employee"></div>
              <div class="item__text">Nhân viên</div>
            </div>
          </div>
          <div class="bottom__item">
            <div class="item__content">
              <div class="item__icon minc mi-24 mi-setting--active"></div>
              <div class="item__text">Tùy chọn</div>
            </div>
          </div>
        </div>
      </div>
      <div class="main__right">
        <div class="right__top">
          <div class="top__title">
            <div class="title__text">BÁO CÁO</div>
          </div>
        </div>
        <div class="right__mid">
          <ul class="rm__ul">
            <li>Bảng kê số dư tiền theo ngày</li>
            <li>Dòng tiền</li>
            <li>S03a1-DN: Sổ nhật ký thu tiền</li>
            <li>Sổ kế toán chi tiết quỹ tiền mặt</li>
            <li>S03a2-DN: Sổ nhật ký chi tiền</li>
          </ul>
        </div>
        <div class="right__bottom">
          <div class="bottom__text">Tất cả báo cáo</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function customerItemOnClick() {
  router.push("/DI/DICustomer");
}

function employeeItemOnClick() {
  router.push("/DI/DIEmployee");
}

function receiveBoxOnClick() {
  router.push("/CA/CAReceipt/create");
}
</script>

<style
  scoped
  lang="css"
  src="../../../../css/components/views/cash/process/cash-process.css"
></style>
