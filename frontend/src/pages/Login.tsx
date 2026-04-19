import { useNavigate } from "react-router-dom";



export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form className="w-[320px] flex flex-col gap-4 p-6 rounded-xl bg-white/5 border border-white/10">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="px-3 py-2 rounded bg-white/10 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="px-3 py-2 rounded bg-white/10 outline-none"
        />
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
      </form>
    </div>
  );
}
