// app.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import CourseList from "../components/CourseList";
import CourseForm from "../components/CourseForm";
import ProgressTracker from "../components/ProgressTracker";
import QuizPage from "../components/QuizPage";
import * as api from "../api";
import "@testing-library/jest-dom"

// Mock useParams and useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: () => jest.fn(),
}));

const mockUseParams = require("react-router-dom").useParams;

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

test("React_APIIntegration_TestingAndAPIDocumentation_FetchCoursesDisplaysAllCourses", async () => {
  jest.spyOn(api, "fetchCourses").mockResolvedValue([
    { id: 1, title: "Math 101", description: "Basic Math" },
    { id: 2, title: "Science 101", description: "Basic Science" },
  ]);

  render(<CourseList />);
  expect(await screen.findByText("Math 101")).toBeInTheDocument();
  expect(await screen.findByText("Science 101")).toBeInTheDocument();
});

test("React_BuildUIComponents_AddCourseSubmitsCorrectPayload", async () => {
  jest.spyOn(api, "addCourse").mockResolvedValue({});

  render(<CourseForm />);
  fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "React" } });
  fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "React basics" } });
  fireEvent.change(screen.getByPlaceholderText("Quiz questions (question*answer)"), {
    target: { value: "What is JSX?*JavaScript XML" },
  });

  fireEvent.click(screen.getByText("Add"));
  await waitFor(() => expect(api.addCourse).toHaveBeenCalled());
});

test("React_APIIntegration_TestingAndAPIDocumentation_EnrollInCourseShowsSuccessAlert", async () => {
  jest.spyOn(api, "fetchCourses").mockResolvedValue([
    { id: 1, title: "Math", description: "Desc" },
  ]);
  jest.spyOn(api, "enrollInCourse").mockResolvedValue({});

  render(<CourseList />);
  await waitFor(() => screen.getByText("Enroll"));
  fireEvent.click(screen.getByText("Enroll"));
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Enrolled successfully!"));
});

test("React_BuildUIComponents_NavigateToProgressTracker", async () => {
  jest.spyOn(api, "fetchCourses").mockResolvedValue([
    { id: 1, title: "Math", description: "Desc" },
  ]);

  render(
    <MemoryRouter>
      <CourseList />
    </MemoryRouter>
  );
  await waitFor(() => screen.getByText("Progress"));
  expect(screen.getByText("Progress").closest("button")).toBeInTheDocument();
});

test("React_APIIntegration_TestingAndAPIDocumentation_ProgressTrackerFetchesAndDisplaysProgress", async () => {
  const mockCourse = [{ id: 1, title: "Math", progress: { john_doe: 75 } }];
  jest.spyOn(api, "fetchCourses").mockResolvedValue(mockCourse);
  mockUseParams.mockReturnValue({ id: "1" });

  render(<ProgressTracker />);
  expect(await screen.findByDisplayValue("75")).toBeInTheDocument();
});

test("React_APIIntegration_TestingAndAPIDocumentation_UpdateProgressSendsCorrectValue", async () => {
  const mockCourse = [{ id: 1, title: "Math", progress: { john_doe: 50 } }];
  jest.spyOn(api, "fetchCourses").mockResolvedValue(mockCourse);
  jest.spyOn(api, "updateProgress").mockResolvedValue({});
  mockUseParams.mockReturnValue({ id: "1" });

  render(<ProgressTracker />);
  await screen.findByDisplayValue("50");
  fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "80" } });
  fireEvent.click(screen.getByText("Update Progress"));

  await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Progress updated"));
});

test("React_APIIntegration_TestingAndAPIDocumentation_QuizPageDisplaysQuestions", async () => {
  const questions = ["What is 2+2?*4", "Capital of France?*Paris"];
  jest.spyOn(api, "getQuiz").mockResolvedValue(questions);
  mockUseParams.mockReturnValue({ id: "1" });

  render(<QuizPage />);
  expect(await screen.findByText("What is 2+2?")).toBeInTheDocument();
  expect(await screen.findByText("Capital of France?")).toBeInTheDocument();
});

test("React_APIIntegration_TestingAndAPIDocumentation_SubmitQuizCalculatesScoreCorrectly", async () => {
  const questions = ["2+2?*4", "Capital?*Paris"];
  jest.spyOn(api, "getQuiz").mockResolvedValue(questions);
  jest.spyOn(api, "submitQuiz").mockResolvedValue("OK");
  mockUseParams.mockReturnValue({ id: "1" });

  render(<QuizPage />);
  await waitFor(() => screen.getByText("2+2?"));
  fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "4" } });
  fireEvent.change(screen.getAllByRole("textbox")[1], { target: { value: "Paris" } });

  fireEvent.click(screen.getByText("Submit Quiz"));
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith("You scored 2/2"));
});

test("React_BuildUIComponents_NavbarLinksNavigateCorrectly", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  expect(screen.getByText("Courses").closest("a")).toHaveAttribute("href", "/courses");
  expect(screen.getByText("Add Course").closest("a")).toHaveAttribute("href", "/add");
});

test("React_BuildUIComponents_HomeComponentDisplaysWelcomeMessage", () => {
  render(<Home />);
  expect(screen.getByText("Welcome to LMS Lite")).toBeInTheDocument();
  expect(screen.getByText(/Manage courses, track progress/i)).toBeInTheDocument();
});
