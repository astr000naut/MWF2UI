import employeeApi from "./employee";
import departmentApi from "./department";
import customerApi from "./customer";
import groupApi from "./group";
const baseUrl = "https://localhost:44381/api/v1";
const $api = {
  employee: employeeApi(baseUrl),
  department: departmentApi(baseUrl),
  customer: customerApi(baseUrl),
  group: groupApi(baseUrl),
};
export default $api;
