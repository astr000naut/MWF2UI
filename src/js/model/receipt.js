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

  constructor(r) {
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
  }

  cloneFromOtherReceipt() {}

  convertToApiFormat() {
    const obj = {};
    return obj;
  }
}
