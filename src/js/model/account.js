export class Account {
  accountId;
  accountNumber;
  accountNameVi;
  accountNameEn;
  parentId;
  parentAccountName;
  categoryKind;
  categoryKindName;
  description;
  status;
  isParent;
  grade;
  mCodeId;
  constructor(a) {
    this.accountId = a.accountId ?? "";
    this.accountNumber = a.accountNumber ?? "";
    this.accountNameVi = a.accountNameVi ?? "";
    this.accountNameEn = a.accountNameEn ?? "";
    this.parentId = a.parentId ?? "";
    this.parentAccountName = a.parentAccountName ?? "";
    this.categoryKind = a.categoryKind != null ? a.categoryKind.toString() : "";
    switch (this.categoryKind) {
      case "0":
        this.categoryKindName = "Dư nợ";
        break;
      case "1":
        this.categoryKindName = "Dư có";
        break;
      case "2":
        this.categoryKindName = "Lưỡng tính";
        break;
      case "3":
        this.categoryKindName = "Không có số dư";
        break;
      default:
        this.categoryKindName = "";
        break;
    }
    this.description = a.description ?? "";
    this.status = a.status ?? "";
    this.isParent = a.isParent ?? false;
    this.grade = a.grade ?? 0;
    this.mCodeId = a.mCodeId ?? "";
  }

  cloneFromOtherAccount(a) {
    this.accountId = a.accountId;
    this.accountNumber = a.accountNumber;
    this.accountNameVi = a.accountNameVi;
    this.accountNameEn = a.accountNameEn;
    this.parentId = a.parentId;
    this.parentAccountName = a.parentAccountName;
    this.categoryKind = a.categoryKind;
    this.categoryKindName = a.categoryKindName;
    this.description = a.description;
    this.status = a.status;
    this.isParent = a.isParent;
    this.grade = a.grade;
    this.mCodeId = a.mCodeId;
  }

  convertToApiFormat() {
    const obj = {
      accountNumber: this.accountNumber,
      accountNameVi: this.accountNameVi,
      accountNameEn: this.accountNameEn,
      parentId: this.parentId != "" ? this.parentId : null,
      parentAccountName: this.parentAccountName,
      categoryKind: this.categoryKind,
      description: this.description,
      detailByBankAccount: this.detailByBankAccount,
      detailByAccountObject: this.detailByAccountObject,
      detailByAccountObjectId: this.detailByAccountObjectId,
    };
    return obj;
  }
}
