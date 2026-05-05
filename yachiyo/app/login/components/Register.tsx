import styles from "../page.module.css";
import { Button } from "@/components/Button";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// 定义注册表单的验证规则
const registerSchema = z
  .object({
    username: z.string().min(1, { message: "用户名至少需要1个字符" }),
    email: z.email({ message: "请输入有效的邮箱地址" }),
    password: z.string().min(6, { message: "密码至少需要6个字符" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入密码不一致",
    path: ["confirmPassword"],
  });
type RegisterSchema = z.infer<typeof registerSchema>;
// 注册组件
export const Register = ({ isToggle }: { isToggle: boolean }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  //提交注册表单
  const onSubmit = async (data: RegisterSchema) => {
    const newData = {
      id: Date.now(),
      ...data,
    };
    console.log("注册数据:", newData);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const result = await response.json();

      if (result.success) {
        message.success(result.message || "注册成功");
      } else {
        message.error(result.message || "注册失败");
      }
    } catch (error) {
      console.error("注册失败:", error);
      message.error("网络错误，请稍后重试");
    }
  };
  return (
    <div
      className={`${styles.container} ${isToggle ? styles.is_txl : ""}  z-100 left-[calc(100%-600px)] `}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className={`${styles.title}`}>创建账号</p>
        <div>
          <input
            type="text"
            placeholder="Username"
            className=""
            {...register("username")}
          />
          {errors.username && (
            <p className={styles.error}>{errors.username.message}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            className=""
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className=""
            {...register("password")}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="ConfirmPassword"
            className=""
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.button} mt-[50px]`}>
          {isSubmitting ? "Signing up..." : "SIGN UP"}
        </Button>
      </form>
    </div>
  );
};
