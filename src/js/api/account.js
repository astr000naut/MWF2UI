const accountApi = (baseUrl) => {
  const controller = "/Accounts";
  return {
    index: baseUrl + controller,
    one: (id) => baseUrl + controller + `/${id}`,
    filter: baseUrl + controller + "/FilterAccount",
  };
};

export default accountApi;
