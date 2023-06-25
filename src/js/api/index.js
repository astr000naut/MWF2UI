import employeeApi from "./employee";
import departmentApi from "./department";
import customerApi from "./customer";
const baseUrl = "https://localhost:44381/api/v1";
const $api = {
  employee: employeeApi(baseUrl),
  department: departmentApi(baseUrl),
  customer: customerApi(baseUrl),
};
export default $api;
