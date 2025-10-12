import React, { useEffect, useState } from "react";
import "../styles/jobportal.css";
import { jobsData } from "../data/jobsData";

export default function JobPortalPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState({
    title: "",
    company: "",
    location: "",
  });

  useEffect(() => {
    setJobs(jobsData);
    setFilteredJobs(jobsData);
  }, []);

  // Handle search/filter
  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.title.toLowerCase()) &&
        job.company.toLowerCase().includes(search.company.toLowerCase()) &&
        job.location.toLowerCase().includes(search.location.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [search, jobs]);

  // Live Job Updates every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomJob = jobsData[Math.floor(Math.random() * jobsData.length)];
      setJobs((prevJobs) => [randomJob, ...prevJobs]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleApply = (job) => {
    alert(`You have applied to ${job.title} at ${job.company}`);
    window.open(job.applyLink, "_blank");
  };

  return (
    <div className="job-portal-container">
      <h2 className="job-portal-title">🚀 Explore Job Openings</h2>

      {/* Search Filters */}
      <div className="job-filters">
        <input
          type="text"
          placeholder="Search by Role"
          value={search.title}
          onChange={(e) => setSearch({ ...search, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Company"
          value={search.company}
          onChange={(e) => setSearch({ ...search, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Location"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
        />
      </div>

      <div className="job-list">
        {filteredJobs.length === 0 && (
          <p className="no-jobs">No jobs match your search 😔</p>
        )}

        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card live-update">
            <img className="job-logo" src={job.logo} alt={job.company} />
            <div className="job-info">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.company}</p>
              <p className="job-location">{job.location}</p>
              <p className="job-description">{job.description}</p>
            </div>
            <button className="apply-btn" onClick={() => handleApply(job)}>
              Apply Official
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
