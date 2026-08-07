import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorisation.middleware.js";
import {
    loginUser,
    logoutUser,
    getCurrentUser,
    getAllInstructors,
    refreshAccessToken,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/instructors").get(verifyJWT, authorizeRoles("admin"), getAllInstructors);

export default router;

