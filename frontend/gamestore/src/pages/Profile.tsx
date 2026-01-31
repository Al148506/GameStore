import NavbarGeneral from "@components/common/Navbar";
import { ProfileInfo } from "../components/user/ProfileInfo";
import { ChangePasswordForm } from "../components/user/ChangePasswordForm";
import "../styles/profile.css";
export const Profile = () => {
  return (
    <>
      <NavbarGeneral />
      <main className="profile-container">
        <div className="profile-content">
          <header className="profile-header">
            <h1 className="profile-title">Mi cuenta</h1>
            <p className="profile-subtitle">Gestiona tu información personal y seguridad</p>
          </header>
          
          <div className="profile-sections">
            <ProfileInfo />
            <ChangePasswordForm />
          </div>
        </div>
        
        <div className="profile-background">
          <div className="gradient-orb gradient-orb-1"></div>
          <div className="gradient-orb gradient-orb-2"></div>
        </div>
      </main>
    </>
  );
};
