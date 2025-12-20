export const fetchCourses = async () => {
  try{
    const response = await fetch("http://localhost:8080/api/courses");
    if(!response.ok){
      throw new Error("Error in getting the courses");
    }

    const data = await response.json();
    return data;
  }catch(fetcherror){
    console.log("Error in getting the courses",fetcherror);
    throw fetcherror;
  }
};

export const addCourse = async (courseData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      throw new Error("Error adding course");
    }

    return await response.json();
  } catch (error) {
    console.error("Add course failed:", error);
    throw error;
  }
};


export const enrollInCourse = async (id,name) => {
  try{
    const response = await fetch(`http://localhost:8080/api/courses/${id}/enroll?student=${name}`,{
      method:"PUT"
    })

    if(!(response.ok)){
      throw new Error("Error in enrolling the student");
    }
 
    const data = await response.json();
    return data;

  }catch(error){
    console.log("Error in enrolling in the course",error);
    throw error;
  }
};

export const getEnrolledStudents = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/courses/${id}/students`);
    if (!response.ok) {
      throw new Error("Failed to fetch enrolled students");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    throw error;
  }
};


export const updateProgress = async (id, progress) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/courses/${id}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ progress })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export const fetchCourseContent = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/courses/${id}/content`);
    if (!response.ok) {
      throw new Error("Error fetching course content");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching course content:", error);
    throw error;
  }
};

export const getQuiz = async (id) => {
  try{
    const response=await fetch(`http://localhost:8080/api/courses/${id}/quiz`);
    if(!(response.ok)){
      throw new Error("Error in getting the quiz questions");
    }
    const data=await response.json();
    return Array.isArray(data) ? data : (typeof data === "string" ? data.split("\n") : []);

  }catch(error){
    console.log("Error in getting the quiz question",error);
    throw error;
  }
};

export const submitQuizScore = async (courseId, username, score) => {
  try {
    const response = await fetch(`http://localhost:8080/api/courses/${courseId}/quiz?student=${username}&score=${score}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Failed to submit quiz score');
    }
    return await response.text();
  } catch (error) {
    console.error('Error submitting quiz score:', error);
    throw error;
  }
};

export const submitQuiz = async (id, answers) => {
  return {};
};


export const registerUser = async(UserDetails)=>{
  try{
    const response = await fetch("http://localhost:8080/api/auth/register",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(UserDetails),
    })
    if(!(response.ok)){
      throw new Error("Error in creating the user details ( registering )")
    }

    const data = await response.json();
    console.log("Registration successful:", data);
    return data;

  }catch(error){
    console.log("Error in registering the LMS");
    throw error;
  }
}

export const loginUser = async (credentials) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data.token;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getDashboardStats = async (username, isAdmin) => {
  try {
    const courses = await fetchCourses();
    
    if (isAdmin) {
      const totalEnrollments = courses.reduce((sum, course) => 
        sum + (course.enrolledStudents?.length || 0), 0
      );
      
      const uniqueStudents = new Set();
      courses.forEach(course => {
        course.enrolledStudents?.forEach(student => uniqueStudents.add(student));
      });

      return {
        totalCourses: courses.length,
        totalStudents: uniqueStudents.size,
        totalEnrollments,
        avgEnrollmentPerCourse: courses.length > 0 ? 
          Math.round(totalEnrollments / courses.length) : 0
      };
    } else {
      const enrolledCourses = courses.filter(course => 
        course.enrolledStudents?.includes(username)
      );
      
      return {
        enrolled: enrolledCourses.length,
        completed: Math.floor(enrolledCourses.length * 0.6),
        inProgress: Math.floor(enrolledCourses.length * 0.4),
        quizzesTaken: Math.floor(enrolledCourses.length * 0.8)
      };
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};


