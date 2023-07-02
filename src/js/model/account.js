export class Account {
  accountId;
  accountNumber;
  accountNameVi;
  accountNameEn;
  parentId;
  property;
  description;
  status;
  isParent;
  grade;
  mCode;
  constructor(a) {
    this.accountId = a.accountId ?? "";
    this.accountNumber = a.accountNumber ?? "";
    this.accountNameVi = a.accountNameVi ?? "";
    this.accountNameEn = a.accountNameEn ?? "";
    this.parentId = a.parentId ?? "";
    this.property = a.property ?? "";
    this.description = a.description ?? "";
    this.status = a.status ?? "";
    this.isParent = a.isParent ?? false;
    this.grade = a.grade ?? 0;
    this.mCode = a.mCode ?? "";
  }

  cloneFromOtherEmployee() {}

  convertToApiFormat() {}
}
