const Router = require("express").Router;

const Meeting = require("../models/Meeting");
const Participant = require("../models/Participant");

const router = Router();

const { Op, Sequelize } = require("sequelize");

router.get("/today", async (req, res, next) => {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setUTCDate(now.getUTCDate() + 1);
  tomorrow.setUTCMonth(now.getUTCMonth());
  tomorrow.setUTCFullYear(now.getUTCFullYear());
  tomorrow.setUTCHours(0, 0, 0, 0);

  try {
    let meetings = await Meeting.findAll({
      include: {
        model: Participant,
        attributes: ["name", "position"],
      },
      where: {
        date: {
          [Op.lt]: tomorrow.toISOString(),
        },
        status: {
          // not equal canceled or completed
          [Op.notIn]: ["Canceled", "Completed"],
        },
      },
      order: [["date", "ASC"]],
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
    res.status(200).json(meetings);
  } catch (error) {
    console.error(error);
    const code = error.code ?? 500;
    const message = error.message ?? "Server Error";
    res.status(code).json({ code, message });
  }
});

router.get("/scheduled", async (req, res, next) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setUTCDate(today.getUTCDate() + 1);
  tomorrow.setUTCMonth(today.getUTCMonth());
  tomorrow.setUTCFullYear(today.getUTCFullYear());
  tomorrow.setUTCHours(0, 0, 0, 0);

  try {
    let meetings = await Meeting.findAll({
      include: {
        model: Participant,
        attributes: ["name", "position"],
      },
      where: {
        date: {
          [Op.gte]: tomorrow.toISOString(),
        },
      },
      order: [["date", "ASC"]],
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
    const code = error.code ?? 500;
    const message = error.message ?? "Server Error";
    res.status(code).json({ code, message });
  }
});

router.get("/completed", async (req, res, next) => {
  try {
    let meetings = await Meeting.findAll({
      include: {
        model: Participant,
        attributes: ["name", "position"],
      },
      where: {
        status: "Completed",
      },
      order: [["date", "ASC"]],
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
    const code = error.code ?? 500;
    const message = error.message ?? "Server Error";
    res.status(code).json({ code, message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { id, title, priority, date, notes, status, participants } = req.body;

    // TODO: check if date in ISO format or not

    console.log(req.body);

    if (id) {
      const error = new Error("Meeting ID should not be provided");
      error.code = 400;
      throw newError;
    }

    console.log(new Date(date).toISOString());
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
    const code = error.code ?? 500;
    const message = error.message ?? "Server Error";
    res.status(code).json({ code, message });
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const meeting = await Meeting.findByPk(id);
    console.log(meeting);

    if (!meeting) {
      const error = new Error("Meeting not found");
      error.code = 404;
      throw error;
    }

    await Participant.destroy({ where: { meeting: meeting.id } });
    await meeting.destroy();

    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (e) {
    console.error(error);
    const code = error.code ?? 500;
    const message = error.message ?? "Server Error";
    res.status(code).json({ code, message });
  }
});

router.patch("/", async (req, res, next) => {
  const { id, title, priority, date, notes, status, participants } = req.body;

  try {
    const meeting = await Meeting.findByPk(id);

    console.log("1");

    if (!meeting) {
      const error = new Error("Meeting not found");
      error.code = 404;
      throw error;
    }

    console.log("2");

    // delete all participants with meeting id = id
    await Participant.destroy({ where: { meeting: id } });

    meeting.title = title;
    meeting.priority = priority;
    meeting.date = date;
    meeting.notes = notes;
    meeting.status = status;

    if (status === "Completed") {
      meeting.duration = Math.floor((new Date() - new Date(date)) / 60000);
      meeting.endTime = new Date();
    }

    participants.forEach(async (participant) => {
      await Participant.create({
        name: participant.name,
        position: participant.position,
        meeting: id,
      });
    });

    await meeting.save();

    const response = {
      ...meeting.dataValues,
      participants: participants,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    const code = error.code ?? 500;
    const message = error.message ?? "Server Error";
    res.status(code).json({ code, message });
  }
});

module.exports = router;
