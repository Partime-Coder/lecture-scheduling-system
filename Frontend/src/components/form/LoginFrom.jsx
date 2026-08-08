import React from "react";
import { Input, Button, Loader } from "../index.js";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../api/userApi.js";
import { useDispatch } from "react-redux";
import { login as setUser } from "../../slices/authSlice.js";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { isLoading, error }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();

      dispatch(setUser(response.data.user));

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">
            {error?.data?.message || "Invalid email or password"}
          </p>
        </div>
      )}

      <div>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
          })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
            <Loader size="sm" />
        ) : (
          "Login"
        )}
      </Button>

    </form>
  );
}

export default LoginForm;