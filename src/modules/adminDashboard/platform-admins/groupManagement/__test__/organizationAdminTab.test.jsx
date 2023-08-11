import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OrganizationAdminTab from "../organizationAdminTab";

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Assessment Management admin", route);
  return render(ui, { wrapper: BrowserRouter });
};

test("Assessment Management admin", () => {
  const route = "/";
  let rolesCategoryList = {};
  renderWithRouter(
    <OrganizationAdminTab rolesCategoryList={rolesCategoryList} />,
    { route }
  );
});
