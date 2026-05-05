import styles from "../page.module.css";
import { Button } from "@/components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { message } from "antd";
import { useRouter } from "next/navigation";
// 定义登录表单的验证规则
const loginSchema = z.object({
  email: z.email({ message: "请输入有效的邮箱地址" }),
  password: z.string().min(1, { message: "请输入密码" }),
});
// 从 zod 模式中推断出表单数据的类型
type LoginFormData = z.infer<typeof loginSchema>;
// 登录组件
export const Login = ({ isToggle }: { isToggle: boolean }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  //提交登录表单
  const onSubmit = async (data: LoginFormData) => {
    console.log("登录表单数据:", data);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // 保存登录信息
        localStorage.setItem("user", JSON.stringify(result.user));
        message.success(result.message || "登录成功");
        // 登录成功后跳转到主页
        router.push("/dashboard");
      } else {
        message.error(result.message || "登录失败");
      }
    } catch (error) {
      console.error("登录失败:", error);
      message.error("网络错误，请稍后重试");
    }
  };
  return (
    <div
      className={`${styles.container} ${isToggle ? [styles.is_txl, styles.is_z].join(" ") : ""} z-0 left-[calc(100%-600px)]`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className={`${styles.title}`}>登入账号</p>
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

        <p
          className="text-[#181818] text-[15px] mt-[25px] 
        border-b border-solid border-[#a0a5a8] leading-[2]">
          忘记密码？
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.button} mt-[50px]`}>
          {isSubmitting ? "Signing in..." : "SIGN IN"}
        </Button>
      </form>
    </div>
  );
};
