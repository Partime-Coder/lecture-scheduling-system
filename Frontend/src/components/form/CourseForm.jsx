import React from "react";
import { Input, Button, Loader, Select } from "../index.js";
import { useForm } from "react-hook-form";
import { useCreateCourseMutation } from "../../api/courseApi.js";

function CourseForm() {
    const [createCourse, { isLoading }] = useCreateCourseMutation();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("level", data.level);
        formData.append("description", data.description);
        formData.append("image", data.image[0]);

        try {
            await createCourse(formData).unwrap();
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Course Name"
                placeholder="Enter course name"
                {...register("name", { required: true })}
            />

            <Select
                label="Level"
                options={["Beginner", "Intermediate", "Advanced"]}
                {...register("level", { required: true })}
            />

            <div>
                <label className="mb-1 block text-sm text-gray-300">
                    Description
                </label>

                <textarea
                    placeholder="Enter course description"
                    rows="4"
                    {...register("description", { required: true })}
                    className="w-full resize-none rounded-lg border border-gray-700 bg-[#1f1f1f] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-300">
                    Course Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: true })}
                    className="w-full text-sm text-gray-400"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? <Loader size="sm" /> : "Create Course"}
            </Button>
        </form>
    );
}

export default CourseForm