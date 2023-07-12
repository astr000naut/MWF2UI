export class ReceiptDetail {
  receiptDetailId;
  receiptID;
  description;
  debitAccountId;
  debitAccountNumber;
  creditAccountId;
  creditAccountNumber;
  customerCode;
  customerName;
  amount;

  constructor(r) {
    this.receiptDetailId = r.receiptDetailId;
    this.receiptID = r.receiptID;
    this.description = r.description;
    this.debitAccountId = r.debitAccountId;
    this.debitAccountNumber = r.debitAccountNumber;
    this.creditAccountId = r.creditAccountId;
    this.creditAccountNumber = r.creditAccountNumber;
    this.customerCode = r.customerCode;
    this.customerName = r.customerName;
    this.amount = r.amount;
  }

  cloneFromOther(r) {
    this.receiptDetailId = r.receiptDetailId;
    this.receiptID = r.receiptID;
    this.description = r.description;
    this.debitAccountId = r.debitAccountId;
    this.debitAccountNumber = r.debitAccountNumber;
    this.creditAccountId = r.creditAccountId;
    this.creditAccountNumber = r.creditAccountNumber;
    this.customerCode = r.customerCode;
    this.customerName = r.customerName;
    this.amount = r.amount;
  }

  convertToApiFormat() {
    const obj = {
      receiptDetailId: this.receiptDetailId,
      receiptID: this.receiptID,
      description: this.description,
      debitAccountId: this.debitAccountId,
      debitAccountNumber: this.debitAccountNumber,
      creditAccountId: this.creditAccountId,
      creditAccountNumber: this.creditAccountNumber,
      customerCode: this.customerCode,
      customerName: this.customerName,
      amount: this.amount,
    };
    return obj;
  }
}
