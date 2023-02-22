import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import PostController from "./post/post.controller";
import ReportController from "./report/report.controller";
import UserController from "./user/user.controller";
import BookingController from "./booking/booking.controller";

new App([new PostController(), new AuthenticationController(), new UserController(), new ReportController(), new RecipeController()]);