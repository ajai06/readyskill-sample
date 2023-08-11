import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "../../../../../context/user/userContext";
import AssessmentManagement from "../groupManage";

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Assessment Management", route);
  return render(ui, { wrapper: BrowserRouter });
};

test("Assessment Management", () => {
  const route = "/";
  renderWithRouter(
    <UserContext>
      <AssessmentManagement />
    </UserContext>,
    { route }
  );
});
