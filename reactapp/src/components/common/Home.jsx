// src/components/Home.jsx

import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import Loader from "./Loader";
import "./Home.css";

export default function Home() {
  // Example stats (replace with real data as needed)
  const [stats, setStats] = useState({
    learning: 950,
    passed: 800,
    courses: 24
  });

  // Animate loader values (optional, for effect)
  const [animated, setAnimated] = useState({ studying: 0, learning: 0, passed: 0, courses: 0 });
  useEffect(() => {
    const keys = Object.keys(stats);
    const intervals = keys.map(key => {
      return setInterval(() => {
        setAnimated(prev => {
          const next = { ...prev };
          if (next[key] < stats[key]) {
            next[key] = Math.min(next[key] + Math.ceil(stats[key] / 40), stats[key]);
          }
          return next;
        });
      }, 30);
    });
    return () => intervals.forEach(clearInterval);
  }, [stats]);

  return (
    <div className="home-bg">
      <div className="home">
        <div className="home-content">
          <h1>LMS</h1>
          <h2 className="home-sub">Learn Today, Be a Champion Tomorrow.</h2>
          <p className="home-desc">Start your journey with our creative learning platform. Track your progress, enroll in courses, and become a champion of tomorrow.</p>
          <div className="home-loaders">
            <Loader label="Learning" value={animated.learning} max={stats.learning} color="#f9c846" Value={0.6}/>
            <Loader label="Passed Out" value={animated.passed} max={stats.passed} color="#22c55e" Value={0.8}/>
            <Loader label="Courses" value={animated.courses} max={stats.courses} color="#23235b" Value={0.4}/>
          </div>
          <ul>
          <button className="cta-btn"><li><Link to="/courses">Get Started</Link></li></button>
          </ul>
        </div>
        <div className="home-illustration">
        </div>
      </div>
    </div>
  );
}