import React, { useState } from 'react'
import { User, Mail, Lock, Save, Eye, EyeOff, Camera } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getInitials, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [profileForm, setProfileForm] = useState({ username: user?.username || '', email: user?.email || '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false });
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try { const res = await authService.updateProfile(profileForm); updateUser(res.user); toast.success('Profile updated!'); }
        catch (err) { toast.error(err.error || 'Update failed'); }
        finally { setProfileLoading(false); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!passwordForm.currentPassword) errs.currentPassword = 'Required';
        if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
        if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setPasswordLoading(true);
        try { await authService.changePassword(passwordForm); toast.success('Password changed!'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
        catch (err) { toast.error(err.error || 'Failed to change password'); }
        finally { setPasswordLoading(false); }
    };

    return (
        <div className="flex flex-col gap-5 md:gap-6 max-w-2xl mx-auto">
            {/* Avatar Section */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-6 md:p-8 text-center animate-fade-in-up">
                <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-linear-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-orange-200/40">
                        {user?.profileImage ? <img src={user.profileImage} alt="" className="w-24 h-24 rounded-full object-cover" /> : getInitials(user?.username)}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-md">
                        <Camera size={14} />
                    </button>
                </div>
                <h2 className="text-xl font-extrabold text-gray-800">{user?.username}</h2>
                <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-2">Member since {formatDate(user?.createdAt)}</p>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-6 md:p-8 animate-fade-in-up stagger-1">
                <h3 className="text-lg font-bold text-gray-800 mb-5">Edit Profile</h3>
                <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                    <Input label="Username" value={profileForm.username} onChange={(e) => setProfileForm(p => ({ ...p, username: e.target.value }))} icon={User} />
                    <Input label="Email" type="email" value={profileForm.email} onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))} icon={Mail} />
                    <Button type="submit" icon={Save} loading={profileLoading} className="self-start">Save Changes</Button>
                </form>
            </div>

            {/* Password Form */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-6 md:p-8 animate-fade-in-up stagger-2">
                <h3 className="text-lg font-bold text-gray-800 mb-5">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                    <Input
                        label="Current Password"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                        icon={Lock}
                        error={errors.currentPassword}
                        rightElement={<button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))} className="text-gray-400"><Eye size={16} /></button>}
                    />
                    <Input
                        label="New Password"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                        icon={Lock}
                        error={errors.newPassword}
                        rightElement={<button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))} className="text-gray-400"><Eye size={16} /></button>}
                    />
                    <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} icon={Lock} error={errors.confirmPassword} />
                    <Button type="submit" icon={Save} loading={passwordLoading} className="self-start">Update Password</Button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;