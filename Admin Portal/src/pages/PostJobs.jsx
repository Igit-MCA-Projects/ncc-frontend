import { useState } from "react";
import toast from "react-hot-toast";
import { Briefcase, Building2, MapPin, IndianRupee, Calendar, Send } from "lucide-react";
import { createJob } from "@/services/adminService";

function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobImage: "",
    skills: "",
    applyLink: "",
    startDate: "",
    endData: "",
    Location: "",
    hirignType: "",
    ctc: "",
    stipend: "",
    organization: {
      name: "",
      email: "",
      phone: "",
      website: "",
      description: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("organization.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        organization: {
          ...prev.organization,
          [key]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!formData.Location.trim()) {
      toast.error("Job location is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Job description is required");
      return;
    }
    if (!formData.skills.trim()) {
      toast.error("At least one skill is required");
      return;
    }

    try {
      const response = await createJob(formData);
      console.log("Job creation response:", response);

      if (response?.success) {
        toast.success(response?.message || "Job posted successfully");
        setFormData({
          title: "",
          description: "",
          jobImage: "",
          skills: "",
          applyLink: "",
          startDate: "",
          endData: "",
          Location: "",
          hirignType: "",
          ctc: "",
          stipend: "",
          organization: {
            name: "",
            email: "",
            phone: "",
            website: "",
            description: "",
          },
        });
      } else {
        toast.error(response?.message || "Failed to post job");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to post job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Post New Job</h1>

      <form
        onSubmit={handleSubmit}
        className="card-surface rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div>
          <label className="text-sm font-medium">Job Title</label>
          <div className="relative mt-1">
            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border pl-10 pr-3 py-2"
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Organization Name</label>
          <div className="relative mt-1">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              name="organization.name"
              value={formData.organization.name}
              onChange={handleChange}
              className="w-full rounded-xl border pl-10 pr-3 py-2"
              placeholder="Google"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Location</label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              className="w-full rounded-xl border pl-10 pr-3 py-2"
              placeholder="Bangalore"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Hiring Type</label>
          <select
            name="hirignType"
            value={formData.hirignType}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          >
            <option value="">Select</option>
            <option value="FULLTIME">Full Time</option>
            <option value="PARTTME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">CTC</label>
          <input
            name="ctc"
            value={formData.ctc}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="8 LPA"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Stipend</label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              className="w-full rounded-xl border pl-10 pr-3 py-2"
              placeholder="20,000/month"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Skills</label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="React, Node.js, MongoDB"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Job Description</label>
          <textarea
            rows={6}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Write job description..."
          />
        </div>

        <div>
          <label className="text-sm font-medium">Apply Link</label>
          <input
            name="applyLink"
            value={formData.applyLink}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="https://company.com/careers"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Start Date</label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border pl-10 pr-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">End Date</label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="datetime-local"
              name="endData"
              value={formData.endData}
              onChange={handleChange}
              className="w-full rounded-xl border pl-10 pr-3 py-2"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white hover:bg-primary/90"
          >
            <Send size={18} />
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostJobPage;