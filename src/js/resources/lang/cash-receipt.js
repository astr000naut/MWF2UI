const cash_receipt = {
  text: {
    totalReceived: "Tổng thu đầu năm đến hiện tại",
    totalPaid: "Tổng chi đầu năm đến hiện tại",
    totalMoney: "Tổng quỹ hiện tại",
    receive: "Thu tiền",
    filter: "Lọc",
    selected: "Đã chọn: ",
    reference: "Tham chiếu",
    amount: "Số lượng",
    originalDoc: "chứng từ gốc",
    posted: "Hạch toán",
    attach: "Đính kèm",
    maxCapacity: "Dung lượng tối đa 5MB",
    attachMessage: "Kéo/thả tệp vào đây hoặc bấm vào đây",
  },
  message: {
    deleteConfirmTitle: "Xác nhận xóa phiếu thu",
    deleteOneMessage: "Xác nhận xóa phiếu thu này?",
    deleteBatchMessage: "Bạn có chắc chắn muốn xóa hàng loạt phiếu thu?",
    autoGenReceiptNo: "Shift + F8 để tự tạo số phiếu thu",
  },
  tooltip: {
    clickToViewDetail: "Bấm vào để xem chi tiết",
    customDisplay: "Tùy chỉnh giao diện",
    help: "Giúp",
    close: "Đóng (ESC)",
    watchDebt: "Xem công nợ",
  },
  toast: {
    deletedSuccess: "Phiếu thu đã bị xóa khỏi hệ thống",
    deletedSuccessAmount: (amount) => `Xóa thành công ${amount} phiếu thu`,
    createSuccess: "Tạo mới phiếu thu thành công",
    updateSuccess: "Cập nhật phiếu thu thành công",
  },
  table_header: {
    postedDate: "NGÀY HẠCH TOÁN",
    receiptDate: "NGÀY CHỨNG TỪ",
    receiptNo: "SỐ CHỨNG TỪ",
    reason: "DIỄN GIẢI",
    totalAmount: "SỐ TIỀN",
    customerName: "ĐỐI TƯỢNG",
    customerCode: "MÃ ĐỐI TƯỢNG",
    customerAddress: "ĐỊA CHỈ",
  },
  form: {
    title: "Phiếu thu ",
  },
  label: {
    contactName: "Người nộp",
    customerName: "Tên khách hàng",
    address: "Địa chỉ",
    reason: "Lý do nộp",
    documentIncluded: "Kèm theo",
    postedDate: "Ngày hạch toán",
    receiptDate: "Ngày phiếu thu",
    receiptNo: "Số phiếu thu",
    totalAmount: "Tổng tiền",
    debitAccount: "Tài khoản nợ",
    creditAccount: "Tài khoản có",
  },
  button: {
    save: "Cất",
    saveAndAdd: "Cất và Thêm",
  },
  formType: [
    "1. Thu tiền khách hàng (không theo hóa đơn)",
    "2. Thu hoàn ứng nhân viên",
    "3. Rút tiền gửi về nhập quỹ",
    "4. Thu khác",
  ],
  detailTable: {
    description: {
      text: "Diễn giải",
      tooltip: "",
    },
    debitAccount: {
      text: "TK nợ",
      tooltip: "Tài khoản nợ",
    },
    creditAccount: {
      text: "TK có",
      tooltip: "Tài khoản có",
    },
    object: {
      text: "Đối tượng",
      tooltip: "",
    },
    objectName: {
      text: "Tên đối tượng",
      tooltip: "",
    },
    amount: {
      text: "Số tiền",
      tooltip: "",
    },
  },
  employeeComboboxTable: {
    employeeCode: "Mã nhân viên",
    employeeFullName: "Tên nhân viên",
    departmentName: "Đơn vị",
    phoneNumber: "ĐT di động",
  },
  error: {
    notEmpty: (field) => `${field} không được để trống`,
    dateMustAfter: (field1, field2) => `${field1} phải lớn hơn ${field2}`,
    invalidInput: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại",
  },
  accountComboboxTable: {
    accountNumber: "Số tài khoản",
    accountNameVi: "Tên tài khoản",
  },
};
export default cash_receipt;