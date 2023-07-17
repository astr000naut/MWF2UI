const accountApi = (baseUrl) => {
  const controller = "/Accounts";
  return {
    index: baseUrl + controller,
    one: (id) => baseUrl + controller + `/${id}`,
    filter: baseUrl + controller + "/FilterAccount",
    checkNumberExist: baseUrl + controller + "/CheckCodeExist",
  };
};

export default accountApi;
