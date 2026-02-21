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
        try {
            const res = await authService.updateProfile(profileForm);
            updateUser(res.user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.error || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!passwordForm.currentPassword) errs.currentPassword = 'Current password is required';
        if (passwordForm.newPassword.length < 6) errs.newPassword = 'New password must be at least 6 characters';
        if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setPasswordLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            toast.success('Password changed!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.error || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="relative">
                    <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-orange-100">
                        {user?.profileImage
                            ? <img src={user.profileImage} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                            : getInitials(user?.username)
                        }
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                    <p className="text-gray-300 text-xs mt-1">Member since {formatDate(user?.createdAt)}</p>
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <User size={18} className="text-orange-500" /> Edit Profile
                </h3>
                <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        name="username"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm(p => ({ ...p, username: e.target.value }))}
                        icon={User}
                        placeholder="Your username"
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                        icon={Mail}
                        placeholder="Your email"
                    />
                    <Button type="submit" icon={Save} loading={profileLoading} className="self-start">
                        Save Changes
                    </Button>
                </form>
            </div>

            {/* Password Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <Lock size={18} className="text-orange-500" /> Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                    <Input
                        label="Current Password"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                        icon={Lock}
                        error={errors.currentPassword}
                        rightElement={
                            <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))} className="text-gray-400">
                                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        }
                    />
                    <Input
                        label="New Password"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                        icon={Lock}
                        error={errors.newPassword}
                        rightElement={
                            <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))} className="text-gray-400">
                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        }
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        icon={Lock}
                        error={errors.confirmPassword}
                    />
                    <Button type="submit" icon={Save} loading={passwordLoading} className="self-start">
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;