//登出逻辑
export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("注销请求失败:", error);
  }

  localStorage.removeItem("user");
  localStorage.removeItem("sessions-storage")
  localStorage.removeItem("knowledge-selection");
  window.location.replace("/login");
}
