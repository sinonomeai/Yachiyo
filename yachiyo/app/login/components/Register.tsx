import styles from "../page.module.css";
import { Button } from "@/components/Button";
export const Register = ({ isToggle }: { isToggle: boolean }) => {
  return (
    <div
      className={`${styles.container} ${isToggle ? styles.is_txl : ""}  z-100 left-[calc(100%-600px)] `}>
      <form>
        <p className={`${styles.title}`}>创建账号</p>
        <input type="text" placeholder="Name" className="" />
        <input type="text" placeholder="Email" className="" />
        <input type="text" placeholder="Password" className="" />
        <input type="text" placeholder="ConfirmPassword" className="" />
        <Button className={`${styles.button} mt-[50px]`} onClick={(e) => e.preventDefault()}>
          SIGN UP
        </Button>
      </form>
    </div>
  );
};
