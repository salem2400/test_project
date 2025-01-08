import React from 'react';
import { useAuth } from '../context/AuthContext';
import PrivateNavbar from '../components/PrivateNavbar';
import '../styles/Profile.css';

function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  
  // استخراج الحرف الأول من البريد الإلكتروني
  const userInitial = user?.email?.charAt(0).toUpperCase() || '؟';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      try {
        await deleteAccount();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('حدث خطأ أثناء محاولة حذف الحساب. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  return (
    <>
      <PrivateNavbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">{userInitial}</div>
              <h1>الملف الشخصي</h1>
            </div>
            <div className="profile-info">
              <h2>معلومات الحساب</h2>
              <div className="info-group">
                <label>البريد الإلكتروني</label>
                <div className="info-value">{user?.email}</div>
              </div>
              <div className="profile-actions">
                <button className="logout-button" onClick={handleLogout}>
                  تسجيل الخروج
                </button>
                <button className="delete-account-button" onClick={handleDeleteAccount}>
                  حذف الحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile; 