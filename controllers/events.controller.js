const { query } = require("express");
const { eventTypes } = require("../models/enums");
const Event = require("../models/event");

const newEvent = async (req, res) => {

    if (!eventTypes.includes(req.body.type.toUpperCase())) {
        return res.status(400).json({
            status: false,
            message: `${req.body.type.toUpperCase()} is not an event type`,
            types: eventTypes
        });
    }

    try {
        const newEvent = new Event({ ...req.body, type: req.body.type.toUpperCase(), createdBy: req.id });
        await newEvent.save();

        res.status(201).json({
            status: true,
            event: newEvent
        });

    } catch (error) {
        console.log(error);
        serverError(res);
    }
}

const getEventsByType = async (req, res) => {

    const { type } = req.params;
    console.log('GETTING TYPE: ' + type);
    const page = Number(req.query.page) || 1;

    if (!eventTypes.includes(type.toUpperCase())) {
        return res.status(400).json({
            status: false,
            message: `${type.toUpperCase()} is not an event type`,
            types: eventTypes
        });
    }

    try {

        const eventsTotal = await Event.find({ type: type.toUpperCase(), isActive: true })
            .select(['-isActive', '-type']);

        const events = await Event.find({ type: type.toUpperCase(), isActive: true })
            .select(['-isActive', '-type'])
            .skip((page - 1) * 20)
            .limit(20);


        res.status(200).json({
            status: true,
            events: events,
            total: eventsTotal.length
        });


    } catch (error) {
        serverError(res);
    }

}


const getEvent = async (req, res) => {

    const { id } = req.params;
    try {

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                status: false,
                message: 'Event not found.'
            });
        } else {
            console.log(event.title);
            res.status(200).json({
                status: true,
                event
            });
        }


    } catch (error) {
        console.log(error);
        serverError(res);
    }
}



const deactivateEvent = async (req, res) => {

    const { id } = req.params;

    try {

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                status: false,
                message: `No event found with id: ${id}`
            })
        }

        event.isActive = false;
        await event.save();

        res.status(200).json({
            status: true,
            message: 'Event deleted'
        });

    } catch (error) {
        serverError(res);
    }
}


const updateEvent = async (req, res) => {

    const { id } = req.params;

    try {

        const event = await Event.findByIdAndUpdate(id, req.body);

        if (!event) {
            return res.status(404).json({
                status: false,
                message: `No event found with id: ${id}`
            })
        }

        await event.save();

        res.status(200).json({
            status: true,
            message: 'Event updated',
            event: event
        });

    } catch (error) {
        serverError(res);
    }
}



const serverError = (res) => {
    res.status(500).json({
        status: false,
        message: 'SERVER ERROR'
    });
}

module.exports = {
    newEvent,
    getEventsByType,
    getEvent,
    deactivateEvent,
    updateEvent
}