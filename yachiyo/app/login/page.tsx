"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { Login } from "./components/Login";
import {Register} from "./components/Register"
import { SwitchBox } from "./components/SwitchBox";
export default function login() {
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [isToggle, setIsToggle] = useState(true);
  const changeForm = (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    setIsToggle(!isToggle);
    setIsChangeForm(true)
    setTimeout(() => {
      setIsChangeForm(false);
    }, 1250);
  }
  return (
    <div className="h-screen w-screen flex items-center justify-center text-[12px] bg-[#ecf0f3] text-[#a0a5a8]">
      <div
        className={`${styles.shell} relative min-w-[1000px] min-h-[600px] p-[25px] rounded-[12px] overflow-hidden `}>
        <Login isToggle={isToggle}></Login>
        <Register isToggle={isToggle}></Register>
        <SwitchBox
          isChangeForm={isChangeForm}
          isToggle={isToggle}
          changeForm={changeForm}></SwitchBox>
      </div>
    </div>
  );
}
