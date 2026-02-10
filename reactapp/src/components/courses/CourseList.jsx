import React, { useEffect, useState } from "react";
import { fetchCourses, enrollInCourse } from "../../api";
import { API_BASE } from "../../api/config";
import { useNavigate } from "react-router-dom";
import "./CourseList.css";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const navigate = useNavigate();

  // ---------- INITIAL LOAD ----------
  useEffect(() => {
    loadCourses();
    checkAdminStatus();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      alert("Failed to load courses");
    }
  };

  // ---------- FILTER + SORT ----------
  useEffect(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (filterBy === "enrolled" && !isAdmin) {
        matchesFilter = course.enrolledStudents?.includes(username);
      } else if (filterBy === "available" && !isAdmin) {
        matchesFilter = !course.enrolledStudents?.includes(username);
      } else if (filterBy === "popular") {
        matchesFilter = (course.enrolledStudents?.length || 0) >= 3;
      }

      return matchesSearch && matchesFilter;
    });

    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "enrollments":
          aValue = a.enrolledStudents?.length || 0;
          bValue = b.enrolledStudents?.length || 0;
          break;
        case "newest":
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      return sortOrder === "asc"
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

    setFilteredCourses(sorted);
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, filterBy, courses, isAdmin, username]);

  // ---------- ADMIN CHECK ----------
  const checkAdminStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.email?.endsWith("@lms.ac.in") || false);
        setUsername(data.username || "");
      }
    } catch (err) {
      console.error("Admin check failed:", err);
    }
  };

  // ---------- ACTIONS ----------
  const handleEnroll = async (courseId, title) => {
    try {
      await enrollInCourse(courseId, username);
      alert(`Successfully enrolled in ${title}`);
      loadCourses();
    } catch {
      alert("Failed to enroll in course");
    }
  };

  const handleShowContent = (course) => {
    navigate(`/content/${course.id}/${course.title}`);
  };

  // ---------- PAGINATION ----------
  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const enrolledCourses = !isAdmin
    ? filteredCourses.filter((c) => c.enrolledStudents?.includes(username))
    : [];

  const availableCourses = !isAdmin
    ? filteredCourses.filter((c) => !c.enrolledStudents?.includes(username))
    : [];

  // ---------- UI ----------
  return (
    <div>
      <h2>Courses ({filteredCourses.length})</h2>

      {/* SEARCH & FILTER UI — unchanged */}

      {!isAdmin && (
        <>
          <h3>Enrolled Courses ({enrolledCourses.length})</h3>
          <ul className="courselist">
            {enrolledCourses.map((c) => (
              <li key={c.id} className="courselistelements">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <button onClick={() => handleShowContent(c)}>Content</button>
                <button onClick={() => navigate(`/attendQuiz/${c.id}/${c.title}`)}>
                  Take Quiz
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {!isAdmin && (
        <>
          <h3>Available Courses ({availableCourses.length})</h3>
          <ul className="courselist">
            {availableCourses.map((c) => (
              <li key={c.id} className="courselistelements">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <button onClick={() => handleShowContent(c)}>Content</button>
                <button onClick={() => handleEnroll(c.id, c.title)}>Enroll</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {isAdmin && (
        <ul className="courselist">
          {currentCourses.map((c) => (
            <li key={c.id} className="courselistelements">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <button onClick={() => handleShowContent(c)}>Content</button>
              <button onClick={() => navigate(`/enrolledstudents/${c.id}/${c.title}`)}>
                Enrolled Students
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>{currentPage} / {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
