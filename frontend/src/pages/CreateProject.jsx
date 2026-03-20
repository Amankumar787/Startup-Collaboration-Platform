import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../store/slices/projectSlice.js";
import toast from "react-hot-toast";

const CreateProject = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading } = useSelector((s) => s.projects);

  const [form, setForm] = useState({
    title:          "",
    description:    "",
    requiredSkills: "",
    maxTeamSize:    5,
    tags:           "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title:          form.title,
      description:    form.description,
      maxTeamSize:    Number(form.maxTeamSize),
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      tags:           form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const result = await dispatch(createProject(payload));
    if (createProject.fulfilled.match(result)) {
      toast.success("Project created successfully!");
      navigate("/founder/dashboard");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: "700px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
          Post a New Project
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Share your startup idea and find the right team
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. AI-powered recipe app"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              rows={6}
              placeholder="Describe your startup idea, what problem it solves, and what you're building..."
              value={form.description}
              onChange={handleChange}
              required
              style={{ resize: "vertical" }}
            />
          </div>

          <div className="form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="requiredSkills"
              placeholder="React, Node.js, MongoDB (comma separated)"
              value={form.requiredSkills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="AI, FinTech, HealthTech (comma separated)"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Max Team Size</label>
            <input
              type="number"
              name="maxTeamSize"
              min={1}
              max={20}
              value={form.maxTeamSize}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1, justifyContent: "center", padding: "12px" }}
            >
              {loading ? "Creating..." : "Post Project"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: "center", padding: "12px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;