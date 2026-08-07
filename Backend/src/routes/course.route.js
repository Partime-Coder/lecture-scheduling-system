import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorisation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    updateCourseImage,
    deleteCourse,
} from "../controllers/course.controller.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("admin"), upload.single("image"), createCourse);
router.route("/").get(verifyJWT,authorizeRoles("admin"), getAllCourses);
router.route("/:courseId").get(verifyJWT,authorizeRoles("admin"), getCourseById);
router.route("/:courseId").patch(verifyJWT, authorizeRoles("admin"), updateCourse);
router.route("/:courseId/image").patch(verifyJWT, authorizeRoles("admin"), upload.single("image"), updateCourseImage);
router.route("/:courseId").delete(verifyJWT, authorizeRoles("admin"), deleteCourse);

export default router;
