import Account from "./components/auth/Account";
import Auth from "./components/auth/Auth";
import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import UserProfile from "./components/auth/UserProfile";

const routes = [
  {
    path: "/",
    Component: Auth,
    children:[
      {
        path:"",
        Component: Account
      },
      {
        path:"login",
        Component: LogIn
      },
      {
        path:"register",
        Component: Register
      },
      {
        path:"user",
        Component: UserProfile
      }
    ]
  }
];

export default routes;
