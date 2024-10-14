// Seed the database with 3 users, with 5 playlists per user

const prisma = require('../prisma');
const seed = async (numUser = 3, numPlaylist = 5) => {
    const playlist = Array.from({ length: numPlaylist }, (_, j) => ({
        name: `Playlist ${j}`,
        description: `Many ways to describe the vibe for playlist ${j}`,
    }));
    for (let i=0; i<numUser; i++) {
        await prisma.user.create({
            data: {
                username: `User ${i}`,
                playlist: {
                    create: playlist,
                },
            },
        });
    }
};
seed()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });