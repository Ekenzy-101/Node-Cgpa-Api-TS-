import lodash from "lodash";
import express, { Request, Response } from "express";

import admin from "../middlewares/admin";
import auth from "../middlewares/auth";
import { validate, getValidationErrors } from "../middlewares/validateCourse";
import validateObjectId from "../middlewares/validateObjectID";
import Course from "../models/course";

const router = express.Router();

router.get("/", [auth, admin], async (_: Request, res: Response) => {
  const courses = await Course.find({}).select("-__v").sort("-updatedAt");
  res.send(courses);
});

router.get("/me", [auth], async (req: Request, res: Response) => {
  const courses = await Course.find({ user: req.user._id })
    .select("-__v")
    .sort("-updatedAt");
  res.send(courses);
});

router.get(
  "/:id",
  [auth, validateObjectId],
  async (req: Request, res: Response) => {
    // Check if course exists
    let course = await Course.findById(req.params.id).select("-__v");
    if (!course)
      return res
        .status(404)
        .send("The course with the given ID was not found.");

    // Check if user is owner of the course
    if (course.user.toString() !== req.user._id)
      return res.status(403).send("Access denied");

    return res.send(course);
  }
);

router.post("/", [auth, ...validate], async (req: Request, res: Response) => {
  // Validate request from the body
  let error = getValidationErrors(req);
  let { semester, unit, level, title, code, score } = error;
  if (
    semester.length ||
    unit.length ||
    level.length ||
    title.length ||
    code.length ||
    score.length
  )
    return res.status(400).json(error);

  let obj = lodash.pick(req.body, [
    "score",
    "grade",
    "semester",
    "unit",
    "level",
    "weightedScore",
    "title",
    "code",
  ]);
  let course = new Course({
    ...obj,
    user: req.user._id,
  });
  course.calculateWeightedScore();
  course.calculateGrade();
  await course.save();

  return res.send(course);
});

router.put(
  "/:id",
  [auth, validateObjectId, ...validate],
  async (req: Request, res: Response) => {
    // Validate request from the body
    let error = getValidationErrors(req);
    let { semester, unit, level, title, code, score } = error;
    if (
      semester.length ||
      unit.length ||
      level.length ||
      title.length ||
      code.length ||
      score.length
    )
      return res.status(400).json(error);

    // Check if course exists
    let course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .send("The course with the given ID was not found.");

    // Check if user is owner of the course
    if (course.user.toString() !== req.user._id)
      return res.status(403).send("Access denied");

    // Update The Course
    course.semester = req.body.semester;
    course.user = req.user._id;
    course.unit = req.body.unit;
    course.level = req.body.level;
    course.title = req.body.title;
    course.code = req.body.code;
    course.score = req.body.score;
    course.updatedAt = Date.now();

    course.calculateWeightedScore();
    course.calculateGrade();
    await course.save();

    return res.send(course);
  }
);

router.delete(
  "/:id",
  [auth, validateObjectId],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    // Check if course exists
    const course = await Course.findById(id);
    if (!course)
      return res
        .status(404)
        .send("The course with the given ID was not found.");

    // Check if user is owner of the course
    if (course.user.toString() !== req.user._id)
      return res.status(403).send("Access denied");

    // Delete the course
    const deletedCourse = await Course.findByIdAndRemove(id);
    return res.send(deletedCourse);
  }
);

export default router;
