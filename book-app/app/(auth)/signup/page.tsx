"use client";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { signup } from "@/app/redux/slices/auth/auth.slices";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username không được phép để trống")
    .min(6, "Username phải có từ 6 ký tự")
    .trim()
    .matches(/^\S*$/, "Username không được chứa khoảng trắng"),
  email: Yup.string()
    .required("Email không được để trống")
    .trim()
    .matches(/^\S*$/, "Email không được chứa khoảng trắng")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không đúng định dạng"),
  password: Yup.string()
    .required("Password không được để trống")
    .trim()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/^\S*$/, "Password không được chứa khoảng trắng")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ in hoa và 1 số"
    ),
  confirmedPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .test("passwords-match", "Mật khẩu xác nhận không khớp", function (value) {
      return value === this.parent.password;
    }),
});

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

export default function SignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, account } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (account) {
      router.push("/login");
    }
  }, [account, router]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Sending data:", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      await dispatch(
        signup({
          username: data.username,
          email: data.email,
          password: data.password,
        })
      ).unwrap();
      reset();
    } catch (err) {
      console.error("Đăng ký thất bại:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
                i
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Create an account!</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex flex-col">
                    <label className="leading-loose">Username</label>
                    <input
                      type="text"
                      {...register("username")}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Username"
                    />
                    {errors.username && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.username.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="leading-loose">Email</label>
                    <input
                      type="text"
                      {...register("email")}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="leading-loose">Password</label>
                    <input
                      type="password"
                      {...register("password")}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Password"
                    />
                    {errors.password && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="leading-loose">Confirm Password</label>
                    <input
                      type="password"
                      {...register("confirmedPassword")}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Confirm Password"
                    />
                    {errors.confirmedPassword && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.confirmedPassword.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Đang xử lý..." : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
