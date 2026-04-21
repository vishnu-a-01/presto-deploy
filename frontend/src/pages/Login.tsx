import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthLogin } from "../api/api";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import ErrorPopup from "./Error";

type LoginData = {
  email: string;
  password: string;
};
const validateLogin = (data: LoginData) => {
  const errors: Partial<Record<keyof LoginData, string>> = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }
  return errors;
};
export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginData>();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginData) => {
    const validationErrors = validateLogin(data);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as keyof LoginData, {
          type: "manual",
          message,
        });
      });
      return;
    }

    try {
      const res = await AuthLogin(data);
      if (res.error) {
        console.error(res.error);
        setLoginError(res.error);
      } else {
        console.log(res);
        auth.login({ name: "", email: data.email, token: res.token });
        navigate("/dashboard");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-[320px] flex flex-col gap-4 p-6 rounded-xl bg-white/5 border border-white/10"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="input"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          className="input"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-white underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
        {loginError && (
          <ErrorPopup
            message={loginError}
            onClose={() => setLoginError(null)}
          />
        )}
      </form>
    </div>
  );
}
