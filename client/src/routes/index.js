import React, { Suspense, lazy } from "react";
import { observer } from "mobx-react";
import { Switch, Route, BrowserRouter as Router, Redirect } from "react-router-dom";

const Login = lazy(() => import("../Modules/login"));
const Registration = lazy(() => import("../Modules/registration"));
const UsersComponent = lazy(() => import("../Modules/Users"))

const redirect = pathname => () => {
  return <Redirect to={{ pathname }} />;
};

const Routes = props => (
  <main>
    <Router>
      <Suspense fallback={<div>...Loading</div>}>
        <Switch>
          <Route
            path="/login"
            exact
            render={() => {
              if (localStorage.getItem("userId")) {
                return (
                  <Redirect to='/dashboard' />
                )
              }
              return <Login {...props} />

            }}
          />
          <Route
            path="/register"
            exact
            render={() =>
              <Registration {...props} />
            }
          />
          <Route
            path="/dashboard"
            exact
            render={() => {
              if (localStorage.getItem("userId")) {
                return (
                  <UsersComponent {...props} />
                )
              }
              console.log("props", props);
              return <Redirect to={'/login'} />

            }}
          />
          <Route
            path="/"
            exact
            render={redirect("login")}
          />
          {/* <Route path="/" component={ModuleRoutes} /> */}
        </Switch>
      </Suspense>
    </Router>
  </main>
);

export default (observer(Routes));
