const Router = require("express").Router;
const router = Router();

const { 
  getTodayMeetings,
  getScheduledMeetings,
  getCompletedMeetings,
  postNewMeeting,
  deleteMeeting,
  updateMeeting
 } = require("../middlewares/meetings");

router.get("/today", getTodayMeetings);

router.get("/scheduled", getScheduledMeetings);

router.get("/completed", getCompletedMeetings);

router.post("/", postNewMeeting);

router.delete("/:id", deleteMeeting);

router.patch("/", updateMeeting);

module.exports = router;
