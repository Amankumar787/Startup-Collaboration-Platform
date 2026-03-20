import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfileApi, updateProfileApi } from "../api/userApi.js";
import useAuth from "../hooks/useAuth.js";
import Loader  from "../components/common/Loader.jsx";
import toast   from "react-hot-toast";

const DeveloperProfile = () => {
  const { id }   = useParams();
  const { user: currentUser } = useAuth();
  const isOwner  = currentUser?._id === id;

  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({
    name: "", bio: "", skills: "", github: "", linkedin: "", portfolio: "",
  });

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await getUserProfileApi(id);
      // Handle nested response: res.data.data or res.data or res
      const profileData = res?.data?.data || res?.data || res;
      setProfile(profileData);
      setForm({
        name:      profileData.name      || "",
        bio:       profileData.bio       || "",
        skills:    profileData.skills?.join(", ") || "",
        github:    profileData.socialLinks?.github    || "",
        linkedin:  profileData.socialLinks?.linkedin  || "",
        portfolio: profileData.socialLinks?.portfolio || "",
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

 const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name:   form.name,
        bio:    form.bio,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        socialLinks: {
          github:    form.github,
          linkedin:  form.linkedin,
          portfolio: form.portfolio,
        },
      };
      const res = await updateProfileApi(payload);
      const profileData = res.data || res;
      setProfile(profileData);
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <div className="container" style={{ padding: "40px 24px" }}>Profile not found</div>;

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: "800px" }}>
      <div className="card" style={{ marginBottom: "24px" }}>
        {/* Profile Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            width:        "80px",
            height:       "80px",
            borderRadius: "50%",
            background:   "var(--accent)",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            fontSize:     "32px",
            fontWeight:   "800",
            flexShrink:   0,
          }}>
           {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "4px" }}>
              {profile.name}
            </h1>
            <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>
              {profile.role}
            </span>
          </div>
          <div style={{ flex: 1, display: editing ? "block" : "none" }}>
            {editing ? (
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  background:   "var(--bg-secondary)",
                  border:       "1px solid var(--border)",
                  borderRadius: "8px",
                  padding:      "8px 12px",
                  color:        "var(--text-primary)",
                  fontSize:     "22px",
                  fontWeight:   "700",
                  marginBottom: "8px",
                  width:        "100%",
                  outline:      "none",
                }}
              />
            ) : (
              <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "4px" }}>
                {profile.name}
              </h1>
            )}
            <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>
              {profile.role}
            </span>
          </div>
          {isOwner && (
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: "8px 20px" }}
            >
              {saving ? "Saving..." : editing ? "Save" : "Edit Profile"}
            </button>
          )}
        </div>

        {/* Bio */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "500" }}>
            BIO
          </h3>
          {editing ? (
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              style={{
                background:   "var(--bg-secondary)",
                border:       "1px solid var(--border)",
                borderRadius: "8px",
                padding:      "10px 12px",
                color:        "var(--text-primary)",
                fontSize:     "14px",
                width:        "100%",
                outline:      "none",
                resize:       "vertical",
              }}
            />
          ) : (
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "15px" }}>
              {profile.bio || "No bio yet."}
            </p>
          )}
        </div>

        {/* Skills */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "500" }}>
            SKILLS
          </h3>
          {editing ? (
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, Python (comma separated)"
              style={{
                background:   "var(--bg-secondary)",
                border:       "1px solid var(--border)",
                borderRadius: "8px",
                padding:      "10px 12px",
                color:        "var(--text-primary)",
                fontSize:     "14px",
                width:        "100%",
                outline:      "none",
              }}
            />
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {profile.skills?.length > 0
                ? profile.skills.map((s) => (
                    <span key={s} className="badge badge-accent">{s}</span>
                  ))
                : <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>No skills added yet</span>
              }
            </div>
          )}
        </div>

        {/* Social Links */}
        <div>
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "500" }}>
            LINKS
          </h3>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["github", "linkedin", "portfolio"].map((field) => (
                <input
                  key={field}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} URL`}
                  style={{
                    background:   "var(--bg-secondary)",
                    border:       "1px solid var(--border)",
                    borderRadius: "8px",
                    padding:      "10px 12px",
                    color:        "var(--text-primary)",
                    fontSize:     "14px",
                    outline:      "none",
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer"
                  className="btn btn-outline" style={{ fontSize: "13px", padding: "6px 14px" }}>
                  GitHub
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"
                  className="btn btn-outline" style={{ fontSize: "13px", padding: "6px 14px" }}>
                  LinkedIn
                </a>
              )}
              {profile.socialLinks?.portfolio && (
                <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer"
                  className="btn btn-outline" style={{ fontSize: "13px", padding: "6px 14px" }}>
                  Portfolio
                </a>
              )}
              {!profile.socialLinks?.github && !profile.socialLinks?.linkedin && !profile.socialLinks?.portfolio && (
                <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>No links added yet</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;