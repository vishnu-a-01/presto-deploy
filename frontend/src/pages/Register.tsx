import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();
  type RegisterData = {
    name: string;
    email: string;
    password: string;
  };

  const onSubmit = async (data: RegisterData) => {
    console.log(data);
    try {
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
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
          className="px-3 py-2 rounded bg-white/10 outline-none"
          placeholder="Name"
          type="text"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-400 text-sm">{errors.name.message}</p>
        )}

        <input
          className="px-3 py-2 rounded bg-white/10 outline-none"
          placeholder="Email"
          type="text"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}

        <input
          className="px-3 py-2 rounded bg-white/10 outline-none"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
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
    </div>
  );
}
