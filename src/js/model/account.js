export class Account {
  accountId;
  accountNumber;
  accountNameVi;
  accountNameEn;
  parentId;
  parentNumber;
  categoryKind;
  categoryKindName;
  description;
  isParent;
  grade;
  mCodeId;
  detailByBankAccount;
  detailByAccountObject;
  detailByAccountObjectKind;
  foreignCurrencyAccounting;
  constructor(a) {
    this.accountId = a.accountId ?? "";
    this.accountNumber = a.accountNumber ?? "";
    this.accountNameVi = a.accountNameVi ?? "";
    this.accountNameEn = a.accountNameEn ?? "";
    this.parentId = a.parentId ?? "";
    this.parentNumber = a.parentNumber ?? "";
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
    this.isParent = a.isParent ?? false;
    this.grade = a.grade ?? 0;
    this.mCodeId = a.mCodeId ?? "";
    this.detailByBankAccount = a.detailByBankAccount;
    this.detailByAccountObject = a.detailByAccountObject;
    this.detailByAccountObjectKind = a.detailByAccountObjectKind;
    this.foreignCurrencyAccounting = a.foreignCurrencyAccounting ?? false;
  }

  cloneFromOtherAccount(a) {
    this.accountId = a.accountId;
    this.accountNumber = a.accountNumber;
    this.accountNameVi = a.accountNameVi;
    this.accountNameEn = a.accountNameEn;
    this.parentId = a.parentId;
    this.parentNumber = a.parentNumber;
    this.categoryKind = a.categoryKind;
    this.categoryKindName = a.categoryKindName;
    this.description = a.description;
    this.isParent = a.isParent;
    this.grade = a.grade;
    this.mCodeId = a.mCodeId;
    this.detailByBankAccount = a.detailByBankAccount;
    this.detailByAccountObject = a.detailByAccountObject;
    this.detailByAccountObjectKind = a.detailByAccountObjectKind;
    this.foreignCurrencyAccounting = a.foreignCurrencyAccounting;
  }

  convertToApiFormat() {
    const obj = {
      accountNumber: this.accountNumber,
      accountNameVi: this.accountNameVi,
      accountNameEn: this.accountNameEn,
      parentId: this.parentId != "" ? this.parentId : null,
      parentNumber: this.parentNumber,
      categoryKind: this.categoryKind,
      description: this.description,
      detailByBankAccount: this.detailByBankAccount,
      detailByAccountObject: this.detailByAccountObject,
      detailByAccountObjectKind: this.detailByAccountObjectKind,
      foreignCurrencyAccounting: this.foreignCurrencyAccounting,
    };
    return obj;
  }
}
