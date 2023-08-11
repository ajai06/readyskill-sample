import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MobileUsersTab from "../mobileUsersTab";

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Assessment Management mobile", route);
  return render(ui, { wrapper: BrowserRouter });
};

test("Assessment Management mobile", () => {
  const route = "/";
  let rolesCategoryList = {};
  renderWithRouter(
    <MobileUsersTab rolesCategoryList={rolesCategoryList} />,
    { route }
  );
});
