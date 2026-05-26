import styles from "../page.module.css";
import { Button } from "@/components/Button/Button";
import { useMouseFollower } from "@/hooks/useMouseFollower";

interface SwitchBoxProps {
  isChangeForm: boolean;
  isToggle: boolean;
  changeForm: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SwitchBox = ({
  isChangeForm,
  isToggle,
  changeForm,
}: SwitchBoxProps) => {
 
  const loginFollower = useMouseFollower();
  const registerFollower = useMouseFollower();

  return (
    <div
      className={`${isChangeForm ? styles.is_gx : ""} ${isToggle ? styles.is_txr : ""} flex justify-center items-center absolute top-0 left-0 
      h-full w-[400px] p-[50px] bg-[#282840]
      z-200 transition-all duration-[1250ms] overflow-hidden
`}>
      {/* 登录面板 */}
      <div
        ref={loginFollower.containerRef}
        className={`${styles.switch_container} ${styles.switch_bg_login} ${isToggle ? styles.is_hidden : ""} `}>
        <img
          ref={loginFollower.targetRef}
          src="/yiruha.jpg"
          alt=""
          className={styles.switch_bg_image}
        />
        <p className={styles.switch_title}>Welcome Back!</p>
        <p className={styles.description}>已有账号？去登陆</p>
        <Button
          className={`${styles.button_switch} mt-[50px]`}
          onClick={changeForm}
          disabled={isChangeForm}>
          SIGN IN
        </Button>
      </div>

      {/* 注册面板 */}
      <div
        ref={registerFollower.containerRef}
        className={`${styles.switch_container} ${styles.switch_bg_register} ${isToggle ? "" : styles.is_hidden}`}>
        <img
          ref={registerFollower.targetRef}
          src="/kaguya.jpg"
          alt=""
          className={styles.switch_bg_image}
        />
        <p className={styles.switch_title}>Hello Friend!</p>
        <p className={styles.description}>没有账号？去注册吧！</p>
        <Button
          className={`${styles.button_switch} mt-[50px]`}
          onClick={changeForm}
          disabled={isChangeForm}>
          SIGN UP
        </Button>
      </div>
    </div>
  );
};
