export class Customer {
  customerId;
  customerType;
  customerCode;
  customerFullName;
  employeeId;
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
  identityCreate;

  constructor(e) {
    this.customerId = e.customerId;
    this.customerType = e.customerType;
    this.customerCode = e.customerCode;
    this.customerFullName = e.customerFullName;
    this.employeeId = e.employeeId;
    this.address = e.address;
    this.phoneNumber = e.phoneNumber;
    this.website = e.website;
    this.contactNamePrefix = e.contactNamePrefix;
    this.contactName = e.contactName;
    this.contactMobile = e.contactMobile;
    this.contactEmail = e.contactEmail;
    this.landLineNumber = e.landLineNumber;
    this.legalRepresentative = e.legalRepresentative;
    this.envoiceContactName = e.envoiceContactName;
    this.envoiceContactEmail = e.envoiceContactEmail;
    this.envoiceContactMobile = e.envoiceContactMobile;
    this.paymentTermName = e.paymentTermName;
    this.dueTime = e.dueTime;
    this.maximizeDebtAmount = e.maximizeDebtAmount;
    this.receiveAccount = e.receiveAccount;
    this.payAccount = e.payAccount;
    this.bankAccountList = e.bankAccountList;
    this.country = e.country;
    this.provinceOrCity = e.provinceOrCity;
    this.district = e.district;
    this.wardOrCommune = e.wardOrCommune;
    this.shippingAddressList = e.shippingAddressList;
    this.description = e.description;
    this.identityNumber = e.identityNumber;
    this.identityDate = e.identityDate;
    this.identityCreate = e.identityCreate;
  }

  /**
   * Trả về Object với định dạng là Body của request
   *
   * Author: Dũng (12/05/2023)
   */
  convertToApiFormat() {
    let obj = {};
    return obj;
  }
}
