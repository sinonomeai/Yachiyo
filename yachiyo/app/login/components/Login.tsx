import styles from "../page.module.css";
import { Button } from "@/components/Button";
export const Login = ({ isToggle }: { isToggle: boolean }) => {
  return (
    <div
      className={`${styles.container} ${isToggle ? [styles.is_txl, styles.is_z].join(" ") : ""} z-0 left-[calc(100%-600px)]`}>
      <form>
        <p className={`${styles.title}`}>登入账号</p>
        <input type="text" placeholder="Name" className="" />
        <input type="text" placeholder="Email" className="" />
        <input type="text" placeholder="Password" className="" />
        <p
          className="text-[#181818] text-[15px] mt-[25px] 
        border-b border-solid border-[#a0a5a8] leading-[2]">
          忘记密码？
        </p>
        <Button
          className={`${styles.button} mt-[50px]`}
          onClick={(e) => e.preventDefault()}>
          SIGN IN
        </Button>
      </form>
    </div>
  );
};
