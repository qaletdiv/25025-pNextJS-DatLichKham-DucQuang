"use client";
import Input from "../../UI/Input";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/app/YubValidation/RegisterSchema/RegisterSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  type RegisterDTO,
  type RegisterForm,
} from "@/app/types/DTO/RegisterDTO/RegisterDTO";
import { Register } from "@/app/(Auth)/register/action";
import AuthContainer from "../../Common/AuthContainer/AuthContainer";
import Button from "../../UI/Button";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const onSubmit = async (data: RegisterDTO) => {
    try {
      await Register(data);
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
    <div>
      <AuthContainer className="bg-gray-100">
        <h1 className="text-2xl py-4 font-bold">Sign Up</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="UserName:"
            {...register("username")}
            error={errors.username?.message}
          />
          <Input
            label="Email:"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password:"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Input
            label="Confirmed Password:"
            type="password"
            {...register("confirmedPassword")}
            error={errors.confirmedPassword?.message}
          />
          <Button
            variant="primary"
            type="submit"
            className="cursor-pointer w-full"
          >
            Sign Up
          </Button>
          <p
            className="text-center font-light text-blue-400 cursor-pointer"
            onClick={handleLogin}
          >
            Already have an account?
          </p>
        </form>
      </AuthContainer>
    </div>
  );
}
