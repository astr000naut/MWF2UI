const customerApi = (baseUrl) => {
  const controller = "/Customers";
  return {
    filter: baseUrl + controller + "/Filter",
    newCode: baseUrl + controller + "/NewCustomerCode",
  };
};

export default customerApi;
