import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthRegister } from "../api/api";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import ErrorPopup from "./Error";
type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const validateRegister = (data: RegisterData) => {
  const errors: Partial<Record<keyof RegisterData, string>> = {};

  if (!data.name) {
    errors.name = "Name is required";
  }

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Minimum 6 characters";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterData>();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterData) => {
    const validationErrors = validateRegister(data);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as keyof RegisterData, {
          type: "manual",
          message,
        });
      });
      return;
    }

    try {
      const res = await AuthRegister({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res.error) {
        console.error(res.error);
        setRegisterError(res.error);
      } else {
        auth.login({ name: data.name, email: data.email, token: res.token });
        navigate("/dashboard");
      }
    } catch (err) {
      setRegisterError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-[320px] flex flex-col gap-4 p-6 rounded-xl bg-white/5 border border-white/10"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <input
          className="input"
          placeholder="Name"
          type="text"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-400 text-sm">{errors.name.message}</p>
        )}

        <input
          className="input"
          placeholder="Email"
          type="text"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}

        <input
          className="input"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}

        <input
          className="input"
          placeholder="Confirm Password"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}

        <button type="submit" className="btn btn-primary">
          Create Account
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="text-white underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
      {registerError && (
        <ErrorPopup
          message={registerError}
          onClose={() => setRegisterError(null)}
        />
      )}
    </div>
  );
}
