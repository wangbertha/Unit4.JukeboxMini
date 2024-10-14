const express = require("express");
const route = express.Router();
module.exports = route;

const prisma = require("../prisma");

route.get("/", async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (e) {
        next(e);
    }
});

route.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: +id },
            include: { playlist: true, },
        });
        res.json(user);
    } catch (e) {
        next(e);
    }
});

route.post("/:id/playlists", async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: +id }
        });
        if (!name || !description) {
            let message = "Please provide the following for the playlist:";
            if (!name) {
                message = message + " [name]";
            }
            if (!description) {
                message = message + " [description]";
            }
            return next({ status: 400, message: message });
        }
        const playlist = await prisma.playlist.create({
            data: { name, description, ownerId: +id },
        })
        res.status(201).json(playlist);
    } catch (e) {
        next(e);
    }
});