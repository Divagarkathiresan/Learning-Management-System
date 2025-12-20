// src/components/CourseList.jsx
import React, { useEffect, useState } from "react";
import { fetchCourses, enrollInCourse } from "../../api";
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
  const [coursesPerPage] = useState(10);
  const [showContent, setShowContent] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data);
      setFilteredCourses(data);
    });
    checkAdminStatus();
  }, []);

  useEffect(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
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
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, filterBy, courses, isAdmin, username]);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.email?.endsWith('@lms.ac.in') || false);
        setUsername(data.username || "");
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  const handleEnroll = async (courseId, courseTitle) => {
    try {
      await enrollInCourse(courseId, username);
      console.log("Student enrolled successfully:", { courseId, courseName: courseTitle, studentName: username });
      
      // Refresh courses to update UI
      const updatedCourses = await fetchCourses();
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
      
      alert(`Successfully enrolled in ${courseTitle}!`);
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll in course');
    }
  };

  const handleShowContent = (course) => {
    navigate(`/content/${course.id}/${course.title}`);
  };

  const enrolledCourses = isAdmin ? [] : filteredCourses.filter(course => 
    course.enrolledStudents?.includes(username)
  );
  const notEnrolledCourses = isAdmin ? filteredCourses : filteredCourses.filter(course => 
    !course.enrolledStudents?.includes(username)
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div>
      <h2>Courses ({filteredCourses.length})</h2>
      
      <div className="course-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="advanced-search-btn"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        
        {showAdvancedSearch && (
          <div className="advanced-filters">
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="title">Title</option>
                <option value="enrollments">Enrollments</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Order:</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Filter:</label>
              <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                <option value="all">All Courses</option>
                {!isAdmin && <option value="enrolled">My Courses</option>}
                {!isAdmin && <option value="available">Available</option>}
                <option value="popular">Popular (3+ students)</option>
              </select>
            </div>
            
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setSortBy("title");
                setSortOrder("asc");
                setFilterBy("all");
              }}
            >
              Clear All
            </button>
          </div>
        )}
        
        <div className="search-results">
          <span>Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {!isAdmin  && (
        <>
          <h3>Enrolled Courses ({enrolledCourses.length})</h3>
          <ul className="courselist">
            {enrolledCourses.map((c) => (
              <li key={c.id} className="courselistelements">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
                      <rect x="3" y="4" width="7" height="16" rx="2" fill="#28a745"/>
                      <rect x="14" y="4" width="7" height="16" rx="2" fill="#a5d6a7"/>
                      <rect x="7" y="7" width="10" height="2" rx="1" fill="#fff"/>
                    </svg>
                  </span>
                  {c.title}
                </h3>
                <p>{c.description}</p>
                <button onClick={() => handleShowContent(c)}>Content</button>
                <button onClick={() => navigate(`/attendQuiz/${c.id}/${c.title}`)}>Take Quiz</button>
                <button onClick={() => navigate(`/quiz/${c.id}/${c.title}`)}>Quiz List</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {!isAdmin && (
        <>
          <h3>Available Courses ({notEnrolledCourses.length})</h3>
          <ul className="courselist">
            {notEnrolledCourses.map((c) => (
              <li key={c.id} className="courselistelements">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
                      <rect x="3" y="4" width="7" height="16" rx="2" fill="#6366f1"/>
                      <rect x="14" y="4" width="7" height="16" rx="2" fill="#a5b4fc"/>
                      <rect x="7" y="7" width="10" height="2" rx="1" fill="#fff"/>
                    </svg>
                  </span>
                  {c.title}
                </h3>
                <p>{c.description}</p>
                <button onClick={() => handleShowContent(c)}>Content</button>
                <button onClick={() => handleEnroll(c.id, c.title)}>Enroll</button>
                <button onClick={() => navigate(`/quiz/${c.id}/${c.title}`)}>Quiz List</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {isAdmin && (
        <ul className="courselist">
          {currentCourses.map((c) => (
            <li key={c.id} className="courselistelements">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
                    <rect x="3" y="4" width="7" height="16" rx="2" fill="#6366f1"/>
                    <rect x="14" y="4" width="7" height="16" rx="2" fill="#a5b4fc"/>
                    <rect x="7" y="7" width="10" height="2" rx="1" fill="#fff"/>
                  </svg>
                </span>
                {c.title}
              </h3>
              <p>{c.description}</p>
              <button onClick={() => handleShowContent(c)}>Content</button>
              <button onClick={() => navigate(`/enrolledstudents/${c.id}/${c.title}`)}>Enrolled Students</button>
              <button onClick={() => navigate(`/quiz/${c.id}/${c.title}`)}>Quiz List</button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="nav-btn"
          >Prev Page
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="nav-btn"
          >Next Page
          </button>
        </div>
      )}


    </div>
  );
}
