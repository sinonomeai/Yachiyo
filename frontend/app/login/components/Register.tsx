import styles from "../page.module.css";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserOutlined } from "@ant-design/icons";
// 定义注册表单的验证规则
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "用户名至少需要1个字符" })
      .max(10, { message: "用户名最多10个字符" }),
    email: z.email({ message: "请输入有效的邮箱地址" }),
    password: z
      .string()
      .min(6, { message: "密码至少需要6个字符" })
      .max(10, { message: "密码最多10个字符" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入密码不一致",
    path: ["confirmPassword"],
  });
type RegisterSchema = z.infer<typeof registerSchema>;
// 注册组件
export const Register = ({
  isToggle,
  changeForm,
}: {
  isToggle: boolean;
  changeForm: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
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
        changeForm();
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
        <div className="flex flex-col">
          <Input
            type="text"
            placeholder="Username"
            label="用户名"
            maxLength={10}
            {...register("username")}>
            <UserOutlined />
          </Input>
          <p className={`${styles.error} ${errors.username ? "visible" : "invisible"}`}>
            {errors.username?.message || ""}
          </p>
        </div>
        <div className="flex flex-col">
          <Input type="email" placeholder="Email" label="电子邮件" {...register("email")}>
            <UserOutlined />
          </Input>
          <p className={`${styles.error} ${errors.email ? "visible" : "invisible"}`}>
            {errors.email?.message || ""}
          </p>
        </div>
        <div className="flex flex-col">
          <Input
            type="password"
            placeholder="Password"
            label="密码"
            maxLength={10}
            {...register("password")}>
            <UserOutlined />
          </Input>
          <p className={`${styles.error} ${errors.password ? "visible" : "invisible"}`}>
            {errors.password?.message || ""}
          </p>
        </div>
        <div className="flex flex-col">
          <Input
            type="password"
            placeholder="ConfirmPassword"
            label="确认密码"
            maxLength={10}
            {...register("confirmPassword")}>
            <UserOutlined />
          </Input>
          <p className={`${styles.error} ${errors.confirmPassword ? "visible" : "invisible"}`}>
            {errors.confirmPassword?.message || ""}
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting} className={`${styles.button} mt-[20px]`}>
          {isSubmitting ? "Signing up..." : "SIGN UP"}
        </Button>
      </form>
    </div>
  );
};
