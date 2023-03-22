import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import UserController from "./user/user.controller";

const app = new App([new AuthenticationController(), new UserController()]);

app.listen();
