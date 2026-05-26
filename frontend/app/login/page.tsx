"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { SwitchBox } from "./components/SwitchBox";
import { Loading } from "@/components/animation/Loading";
export default function login() {
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [isToggle, setIsToggle] = useState(true);
  const changeForm = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setIsToggle(!isToggle);
    setIsChangeForm(true);
    setTimeout(() => {
      setIsChangeForm(false);
    }, 1250);
  };
  return (
    <div
      className={` ${styles.background} h-screen w-screen flex items-center justify-center text-[12px] bg-[#14141f] text-[#8a8aa0]`}>
      <Loading />
      <div
        className={`${styles.shell} z-5 relative min-w-[1000px] min-h-[600px] p-[25px] rounded-[12px] overflow-hidden `}>
        <Login isToggle={isToggle}></Login>
        <Register isToggle={isToggle} changeForm={changeForm}></Register>
        <SwitchBox
          isChangeForm={isChangeForm}
          isToggle={isToggle}
          changeForm={changeForm}></SwitchBox>
      </div>
    </div>
  );
}
