import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import "./Home.css";

export default function Home() {
  const [stats] = useState({
    learning: 950,
    passed: 800,
    courses: 24,
  });

  const [animated, setAnimated] = useState({
    learning: 0,
    passed: 0,
    courses: 0,
  });

  useEffect(() => {
    const keys = Object.keys(stats);

    const intervals = keys.map((key) =>
      setInterval(() => {
        setAnimated((prev) => {
          if (prev[key] >= stats[key]) return prev;
          return {
            ...prev,
            [key]: Math.min(
              prev[key] + Math.ceil(stats[key] / 40),
              stats[key]
            ),
          };
        });
      }, 30)
    );

    return () => intervals.forEach(clearInterval);
  }, [stats]);

  return (
    <div className="home-bg">
      <div className="home">
        <div className="home-content">
          <h1>LMS</h1>
          <h2 className="home-sub">
            Learn Today, Be a Champion Tomorrow.
          </h2>

          <p className="home-desc">
            Start your journey with our creative learning platform. Track your
            progress, enroll in courses, and become a champion of tomorrow.
          </p>

          <div className="home-loaders">
            <Loader
              label="Learning"
              value={animated.learning}
              max={stats.learning}
              color="#f9c846"
              ratio={0.6}
            />
            <Loader
              label="Passed Out"
              value={animated.passed}
              max={stats.passed}
              color="#22c55e"
              ratio={0.8}
            />
            <Loader
              label="Courses"
              value={animated.courses}
              max={stats.courses}
              color="#23235b"
              ratio={0.4}
            />
          </div>

          <div className="cta-wrapper">
            <Link to="/courses" className="cta-btn">
              Get Started
            </Link>
          </div>
        </div>

        <div className="home-illustration" />
      </div>
    </div>
  );
}
