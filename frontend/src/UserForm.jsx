import React, { useState } from 'react';

const getInitialState = (initialValues = {}) => ({
  username: initialValues.username || '',
  email: initialValues.email || '',
  password: '',
  role: initialValues.role || 'user',
  avatarUrl: initialValues.avatarUrl || '',
  social: {
    linkedin: initialValues.social?.linkedin || '',
    github: initialValues.social?.github || '',
    leetcode: initialValues.social?.leetcode || '',
    website: initialValues.social?.website || '',
  },
});

const UserForm = ({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  loading = false,
  requirePassword = true,
  includeRole = false,
}) => {
  const [form, setForm] = useState(getInitialState(initialValues));
  const [uploadError, setUploadError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be 2MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadError('');
      handleChange('avatarUrl', typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => setUploadError('Unable to read the selected image.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      username: form.username.trim(),
      email: form.email.trim(),
      ...(form.password.trim() ? { password: form.password.trim() } : {}),
      ...(includeRole ? { role: form.role } : {}),
      avatarUrl: form.avatarUrl,
      social: {
        linkedin: form.social.linkedin.trim(),
        github: form.social.github.trim(),
        leetcode: form.social.leetcode.trim(),
        website: form.social.website.trim(),
      },
    });
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit}>
      <div className="col-md-4">
        <label className="form-label" htmlFor="user-username">Username</label>
        <input
          id="user-username"
          className="form-control"
          value={form.username}
          onChange={(event) => handleChange('username', event.target.value)}
          placeholder="Ada Lovelace"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor="user-email">Email</label>
        <input
          id="user-email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={(event) => handleChange('email', event.target.value)}
          placeholder="ada@team.com"
        />
      </div>
      <div className={includeRole ? 'col-md-2' : 'col-md-4'}>
        <label className="form-label" htmlFor="user-password">
          {requirePassword ? 'Password' : 'Password (optional)'}
        </label>
        <input
          id="user-password"
          type="password"
          className="form-control"
          value={form.password}
          onChange={(event) => handleChange('password', event.target.value)}
          placeholder={requirePassword ? 'Minimum 6 characters' : 'Leave blank to keep current'}
        />
      </div>
      {includeRole && (
        <div className="col-md-2">
          <label className="form-label" htmlFor="user-role">Role</label>
          <select
            id="user-role"
            className="form-select"
            value={form.role}
            onChange={(event) => handleChange('role', event.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

      <div className="col-md-6">
        <label className="form-label" htmlFor="user-avatar-upload">Profile picture</label>
        <input
          id="user-avatar-upload"
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImageUpload}
        />
        {uploadError && <small className="text-danger">{uploadError}</small>}
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="user-avatar-url">Profile picture URL (optional)</label>
        <input
          id="user-avatar-url"
          type="url"
          className="form-control"
          value={form.avatarUrl.startsWith('data:image/') ? '' : form.avatarUrl}
          onChange={(event) => handleChange('avatarUrl', event.target.value)}
          placeholder="https://example.com/avatar.png"
        />
      </div>

      {form.avatarUrl && (
        <div className="col-12">
          <img
            src={form.avatarUrl}
            alt="Profile preview"
            className="rounded border"
            style={{ width: '96px', height: '96px', objectFit: 'cover' }}
          />
        </div>
      )}

      <div className="col-md-6">
        <label className="form-label" htmlFor="user-linkedin">LinkedIn</label>
        <input
          id="user-linkedin"
          type="url"
          className="form-control"
          value={form.social.linkedin}
          onChange={(event) => handleSocialChange('linkedin', event.target.value)}
          placeholder="https://linkedin.com/in/username"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="user-github">GitHub</label>
        <input
          id="user-github"
          type="url"
          className="form-control"
          value={form.social.github}
          onChange={(event) => handleSocialChange('github', event.target.value)}
          placeholder="https://github.com/username"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="user-leetcode">LeetCode</label>
        <input
          id="user-leetcode"
          type="url"
          className="form-control"
          value={form.social.leetcode}
          onChange={(event) => handleSocialChange('leetcode', event.target.value)}
          placeholder="https://leetcode.com/u/username"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="user-website">Website</label>
        <input
          id="user-website"
          type="url"
          className="form-control"
          value={form.social.website}
          onChange={(event) => handleSocialChange('website', event.target.value)}
          placeholder="https://your-site.com"
        />
      </div>

      <div className="col-12 d-flex flex-wrap justify-content-end gap-2">
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
