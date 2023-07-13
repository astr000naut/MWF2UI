import $formatter from "../common/formater";
export class Receipt {
  receiptId;
  customerId;
  customerCode;
  customerName;
  contactName;
  customerAddress;
  employeeId;
  employeeName;
  reason;
  documentIncluded;
  postedDate;
  receiptDate;
  receiptNo;
  totalAmount;
  receiptDetailList;

  constructor(r) {
    this.receiptId = r.receiptId ?? "";
    this.customerId = r.customerId ?? "";
    this.customerCode = r.customerCode ?? "";
    this.customerName = r.customerName ?? "";
    this.contactName = r.contactName ?? "";
    this.customerAddress = r.customerAddress ?? "";
    this.employeeId = r.employeeId ?? "";
    this.employeeName = r.employeeName ?? "";
    this.reason = r.reason ?? "";
    this.documentIncluded = "";
    if (r.documentIncluded != null) {
      this.documentIncluded = r.documentIncluded.toString();
    }
    this.postedDate = $formatter.changeFormat(r.postedDate);
    this.receiptDate = $formatter.changeFormat(r.receiptDate);
    this.receiptNo = r.receiptNo ?? "";
    this.totalAmount = r.totalAmount ?? 0;
    this.receiptDetailList = r.receiptDetailList ?? [];
  }

  cloneFromOtherReceipt(r) {
    this.receiptId = r.receiptId;
    this.customerId = r.customerId;
    this.customerCode = r.customerCode;
    this.customerName = r.customerName;
    this.contactName = r.contactName;
    this.customerAddress = r.customerAddress;
    this.employeeId = r.employeeId;
    this.employeeName = r.employeeName;
    this.reason = r.reason;
    this.documentIncluded = r.documentIncluded;
    this.postedDate = r.postedDate;
    this.receiptDate = r.receiptDate;
    this.receiptNo = r.receiptNo;
    this.totalAmount = r.totalAmount;
    this.receiptDetailList = r.receiptDetailList;
  }

  convertToApiFormat() {
    const obj = {
      customerId: this.customerId.length > 0 ? this.customerId : null,
      customerCode: this.customerCode,
      customerName: this.customerName,
      contactName: this.contactName,
      customerAddress: this.customerAddress,
      employeeId: this.employeeId.length > 0 ? this.employeeId : null,
      employeeName: this.employeeName,
      reason: this.reason,
      documentIncluded: Number(this.documentIncluded),
      postedDate: $formatter.formatDateToApiDate(this.postedDate),
      receiptDate: $formatter.formatDateToApiDate(this.receiptDate),
      receiptNo: this.receiptNo,
      totalAmount: Number(this.totalAmount),
      receiptDetailList: this.receiptDetailList,
    };
    return obj;
  }
}
