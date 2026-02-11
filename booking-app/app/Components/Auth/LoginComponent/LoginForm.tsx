"use client";

import Input from "../../UI/Input";
import {
  type LoginDTO,
  type LoginForm,
} from "@/app/types/DTO/LoginDTO/LoginDTO";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/app/YubValidation/LoginSchema/LoginSchema";
import { useForm } from "react-hook-form";
import { Login } from "@/app/(Auth)/login/action";
import Button from "../../UI/Button";
import AuthContainer from "../../Common/AuthContainer/AuthContainer";
export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: LoginDTO) => {
    try {
      await Login(data);
    } catch (error) {
      if (error instanceof Error) {
        setError("email", {
          type: "server",
          message: error.message,
        });
      }
    }
  };

  return (
    <div className="bg-gray-100">
      <AuthContainer>
        <h1 className="text-2xl py-4 font-bold">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email:"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password:"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button variant="primary" type="submit" className="cursor-pointer w-full">
            Submit
          </Button>
        </form>
      </AuthContainer>
    </div>
  );
}
