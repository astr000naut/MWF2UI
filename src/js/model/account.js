export class Account {
  accountId;
  accountNumber;
  accountNameVi;
  accountNameEn;
  parentId;
  categoryKind;
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
    this.categoryKind = a.categoryKind ?? "Dư nợ";
    this.description = a.description ?? "";
    this.status = a.status ?? "";
    this.isParent = a.isParent ?? false;
    this.grade = a.grade ?? 0;
    this.mCodeId = a.mCodeId ?? "";
  }

  cloneFromOtherEmployee() {}

  convertToApiFormat() {}
}
