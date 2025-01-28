const Router = require("express").Router;

const Meeting = require("../models/Meeting");
const Participant = require("../models/Participant");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    let meetings = await Meeting.findAll({
      include: {
        model: Participant,
        attributes: ["id", "name", "position"],
      },
    });

    meetings = meetings.map((meeting) => ({
      ...meeting.dataValues,
      participants: meeting.dataValues.Participants,
    }));

    meetings = meetings.map((meeting) => {
      delete meeting.Participants;
      return meeting;
    });

    console.log(meetings);
    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { id, title, priority, date, notes, status, participants } = req.body;

    console.log(req.body);

    if (id) {
      const newError = new Error("Meeting ID should not be provided");
      newError.status = 400;
      throw newError;
    }

    const meeting = await Meeting.create({
      title,
      priority,
      date,
      notes,
      status,
    });

    for (const participant of participants) {
      const { name, position } = participant;
      await Participant.create({ name, position, meeting: meeting.id });
    }

    const participantsList = await Participant.findAll({
      where: { meeting: meeting.id },
    });

    const response = {
      ...meeting.dataValues,
      participants: participantsList.map((participant) => {
        return {
          id: participant.dataValues.id,
          name: participant.dataValues.name,
          position: participant.dataValues.position,
        };
      }),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const meeting = await Meeting.findByPk(id);
    console.log(meeting);

    if (!meeting) {
      const error = new Error("Meeting not found");
      error.status = 404;
      throw error;
    }

    await Participant.destroy({ where: { meeting: meeting.id } });
    await meeting.destroy();

    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(e.status ?? 500).json({ message: e.message ?? "Server Error" });
  }
});

router.put("/", async (req, res, next) => {

    const {id, title, priority, date, notes, status, participants} = req.body;
    




});

module.exports = router;
