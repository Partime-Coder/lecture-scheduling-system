import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorisation.middleware.js";
import {
    createLecture,
    getAllLectures,
    getMyLectures,

} from "../controllers/lecture.controller.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("admin"), createLecture);
router.route("/").get(verifyJWT, authorizeRoles("admin"), getAllLectures);
router.route("/my-lectures").get(verifyJWT, authorizeRoles("instructor"), getMyLectures);

export default router;
