import React, { Fragment, Component } from "react";
import "antd/dist/antd.css";
import "./App.scss";
import Home from "./container/home";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminDashboard from "./container/admin-dashboard";
import AdminPosts from "./container/admin-posts";
import Category from "./container/category";
import NewsDetail from "./container/news-detail";
import NotFound from "./component/not-found";
import SearchPage from "./container/searchpage";
import AdminCreate from "./container/admin-create";
import Login from "./component/auth/login";
import SignUp from "./component/auth/sign-up";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";
import { setCurrentUser, logout } from "./actions/authAction";
import AdminAddUser from "./container/admin-adduser";
import AdminUsers from "./container/admin-users";
import Permission from "./component/permission";

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      this.props.setCurrentUser(decoded);

      // logout when token expired
      if (Date.now() / 1000 > decoded.exp) {
        this.props.logout();
      }
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
      }
    }
  }

  render() {
    // const storedToken = localStorage.getItem("token");
    // if (storedToken) {
    //   let decodedData = decode(storedToken, { header: true });
    //   let expirationDate = decodedData.exp;
    //   var current_time = Date.now() / 1000;
    //   if (expirationDate < current_time) {
    //     localStorage.removeItem("token");
    //   }
    // }
    const { isAuthenticated } = this.props.auth;
    // console.log(this.props.auth.profile)
    let { usertype } = this.props.auth.profile;
    return (
      <Fragment>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/admin/dashboard" exact component={AdminDashboard} />
            <Route path="/admin/posts" exact component={AdminPosts} />
            <Route path="/admin/posts/create" exact component={AdminCreate} />
            <Route path="/admin/users" exact component={AdminUsers} />
            <Route path="/admin/add-user" exact component={AdminAddUser} />
            <Route path="/category/:id" exact component={Category} />
            <Route path="/search" exact component={SearchPage} />
            <Route path="/login" exact component={Login} />
            <Route path="/permission" exact component={Permission} />
            <Route
              path="/admin/signup"
              exact
              component={isAuthenticated ? SignUp : Login}
            />
            {/* <Route path="/detail/:id" exact component={NewsDetail} /> */}
            <Route path="/:slug" exact component={NewsDetail} />

            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, { setCurrentUser, logout })(App);
