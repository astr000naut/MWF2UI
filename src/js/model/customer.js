export class Customer {
  customerId;
  customerType;
  customerTIN;
  customerCode;
  customerFullName;
  employeeId;
  employeeFullName;
  address;
  phoneNumber;
  website;
  contactNamePrefix;
  contactName;
  contactMobile;
  contactEmail;
  landLineNumber;
  legalRepresentative;
  envoiceContactName;
  envoiceContactEmail;
  envoiceContactMobile;
  paymentTermName;
  dueTime;
  maximizeDebtAmount;
  receiveAccount;
  payAccount;
  bankAccountList;
  country;
  provinceOrCity;
  district;
  wardOrCommune;
  shippingAddressList;
  description;
  identityNumber;
  identityDate;
  identityPlace;
  groupCodeList;

  constructor(e) {
    this.customerId = e.customerId ?? "";
    this.customerType = e.customerType ?? 0;
    this.customerTIN = e.customerTIN ?? "";
    this.customerCode = e.customerCode ?? "";
    this.customerFullName = e.customerFullName ?? "";
    this.employeeId = e.employeeId ?? "";
    this.employeeFullName = e.employeeFullName ?? "";
    this.address = e.address ?? "";
    this.phoneNumber = e.phoneNumber ?? "";
    this.website = e.website ?? "";
    this.contactNamePrefix = e.contactNamePrefix ?? "";
    this.contactName = e.contactName ?? "";
    this.contactMobile = e.contactMobile ?? "";
    this.contactEmail = e.contactEmail ?? "";
    this.landLineNumber = e.landLineNumber ?? "";
    this.legalRepresentative = e.legalRepresentative ?? "";
    this.envoiceContactName = e.envoiceContactName ?? "";
    this.envoiceContactEmail = e.envoiceContactEmail ?? "";
    this.envoiceContactMobile = e.envoiceContactMobile ?? "";
    this.paymentTermName = e.paymentTermName ?? "";
    this.dueTime = e.dueTime ?? "";
    this.maximizeDebtAmount = "";
    this.receiveAccount = e.receiveAccount ?? "";
    this.payAccount = e.payAccount ?? "";
    this.bankAccountList = e.bankAccountList ?? "";
    this.country = e.country ?? "";
    this.provinceOrCity = e.provinceOrCity ?? "";
    this.district = e.district ?? "";
    this.wardOrCommune = e.wardOrCommune ?? "";
    this.shippingAddressList = e.shippingAddressList ?? "";
    this.description = e.description ?? "";
    this.identityNumber = e.identityNumber ?? "";
    this.identityDate = e.identityDate ?? "";
    this.identityPlace = e.identityPlace ?? "";
    this.groupCodeList = e.groupCodeList ? e.groupCodeList.split(",") : [];
  }

  /**
   * Trả về Object với định dạng là Body của request
   *
   * Author: Dũng (12/05/2023)
   */
  convertToApiFormat() {
    let obj = {
      customerType: this.customerType,
      customerTIN: this.customerTIN,
      customerCode: this.customerCode,
      customerFullName: this.customerFullName,
      employeeId: this.employeeId,
      address: this.address,
      phoneNumber: this.phoneNumber,
      website: this.website,
      contactNamePrefix: this.contactNamePrefix,
      contactName: this.contactName,
      contactMobile: this.contactMobile,
      contactEmail: this.contactEmail,
      landLineNumber: this.landLineNumber,
      legalRepresentative: this.legalRepresentative,
      envoiceContactName: this.envoiceContactName,
      envoiceContactEmail: this.envoiceContactEmail,
      envoiceContactMobile: this.envoiceContactMobile,
      paymentTermName: this.paymentTermName,
      dueTime: null,
      maximizeDebtAmount: null,
      receiveAccount: this.receiveAccount,
      payAccount: this.payAccount,
      bankAccountList: null,
      country: this.country,
      provinceOrCity: this.provinceOrCity,
      district: this.district,
      wardOrCommune: this.wardOrCommune,
      shippingAddressList: null,
      description: this.description,
      identityNumber: this.identityNumber,
      identityDate: null,
      identityPlace: this.identityPlace,
      groupCodeList: this.groupCodeList.join(","),
    };
    return obj;
  }
}
