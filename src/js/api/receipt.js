const receiptApi = (baseUrl) => {
  const controller = "/Receipts";
  return {
    index: baseUrl + controller,
    one: (id) => baseUrl + controller + `/${id}`,
    filter: baseUrl + controller + "/Filter",
    newReceiptNo: baseUrl + controller + "/NewReceiptNo",
    deleteMultiple: baseUrl + controller + "/DeleteMultiple",
  };
};

export default receiptApi;