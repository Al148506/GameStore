import React from "react";
import NavbarGeneral from "@components/Navbar";
import { ProfileInfo } from "../components/user/ProfileInfo";
import { ChangePasswordForm } from "../components/user/ChangePasswordForm";
import "../styles/profile.css";
export const Profile = () => {
  return (
    <>
      <NavbarGeneral />
      <main className="profile-container">
        <h1>Mi cuenta</h1>
        <ProfileInfo />
        <ChangePasswordForm />
      </main>
    </>
  );
};
