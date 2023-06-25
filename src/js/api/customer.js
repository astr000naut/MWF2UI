const customerApi = (baseUrl) => {
  const controller = "/Customers";
  return {
    filter: baseUrl + controller + "/Filter",
  };
};

export default customerApi;
