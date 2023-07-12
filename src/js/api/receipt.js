const receiptApi = (baseUrl) => {
  const controller = "/Receipts";
  return {
    index: baseUrl + controller,
    one: (id) => baseUrl + controller + `/${id}`,
    filter: baseUrl + controller + "/Filter",
  };
};

export default receiptApi;
