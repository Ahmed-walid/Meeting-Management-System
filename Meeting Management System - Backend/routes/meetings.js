const Router = require('express').Router;


const Meeting = require('../models/Meeting');
const Participant = require('../models/Participant');


const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const meetings = await Meeting.findAll();
        res.json(meetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {id, title, priority, date, notes, status, participants } = req.body;

        console.log(req.body);

        if(id){
            const newError = new Error('Meeting ID should not be provided');
            newError.status = 400;
            throw newError;
        }

        const meeting = await Meeting.create({ title, priority, date, notes, status });
        
        for(const participant of participants){
            const {name, position} = participant;
            await Participant.create({name, position, meeting: meeting.id});
        }

        res.json(meeting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.delete('/:id',async (req, res, next)=>{
    const id = req.params.id;
    try{
        
        const meeting = await Meeting.findByPk(id);
        console.log(meeting);

        if(!meeting){
            const error = new Error("Meeting not found");
            error.status = 404;
            throw error;
        }

        await Participant.destroy({where:{meeting: meeting.id}});

        await  meeting.destroy();

        res.status(200).json({message: "Meeting deleted successfully"});

    } catch(e){
        console.log(e);
        res.status(e.status ?? 500).json({message: e.message ?? 'Server Error'})
    }
});

module.exports = router;