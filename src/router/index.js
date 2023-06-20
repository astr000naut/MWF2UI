import EmployeeList from "../components/views/category/employee/EmployeeList";
import UnderDevelopment from "../components/views/under-development/UnderDevelopment";
import EmployeeForm from "../components/views/category/employee/EmployeeForm";
import CategoryPage from "../components/views/category/CategoryPage";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/DI",
    component: CategoryPage,
    children: [
      {
        path: "DIEmployee",
        component: EmployeeList,
        children: [
          {
            path: "create",
            components: {
              default: EmployeeList,
              EmployeeForm: EmployeeForm,
            },
          },
          {
            path: ":id",
            components: {
              default: EmployeeList,
              EmployeeForm: EmployeeForm,
            },
          },
        ],
      },
    ],
  },
  { path: "/under-development/:id", component: UnderDevelopment },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
