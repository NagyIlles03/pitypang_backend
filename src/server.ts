import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import PersonController from "./person/person.controller";
import ReportController from "./report/report.controller";
import UserController from "./user/user.controller";
import RecipeController from "./recipe/recipe.controller";

const app = new App([new PersonController(), new AuthenticationController(), new UserController(), new ReportController(), new RecipeController()]);

app.listen();
