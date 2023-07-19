const cat_account = {
  pageTitle: "Hệ thống tài khoản",
  button: {
    addAccount: "Thêm mới tài khoản",
    goBack: "Tất cả danh mục",
    reload: "Tải lại dữ liệu",
    export: "Xuất dữ liệu",
  },
  form: {
    title: {
      edit: "Sửa tài khoản",
      add: "Thêm tài khoản",
    },
  },
  text: {
    searchAccount: "Tìm kiếm tài khoản",
    expand: "Mở rộng",
    collapse: "Thu gọn",
  },
  message: {
    confirmDeleteTitle: "Xác nhận xóa tài khoản",
    confirmDeleteMessage: (accNameVi) =>
      `Bạn có muốn xóa tài khoản ${accNameVi}`,
    deleteSuccess: "Tài khoản đã bị xóa",
    deleteParentWarnning:
      "Không thể xóa danh mục cha nếu chưa xóa danh mục con",
    createSuccess: "Tạo mới tài khoản thành công",
    updateSuccess: "Cập nhật tài khoản thành công",
  },
};
export default cat_account;
