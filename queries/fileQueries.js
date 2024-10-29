const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFile = async (name, size, uploadTime, accountId, folderId, relativeRoute ) => {
    await prisma.file.create({
        data: {
            name,
            size,
            uploadTime,
            accountId,
            folderId,
            relativeRoute
        }
    })
}

module.exports.getFiles = async (folder_id) => {
    return prisma.file.findMany({
        where: {
            folder_id,
        }
    })
}

module.exports.getFile = async (id) => {
    return prisma.file.findUnique({
        where: {
            id,
        }
    })
}

module.exports.getName = async (id) => {
    return prisma.file.findUnique({
        where: {
            id,
        },
        select: {
            name: true,
        }
    })
}

module.exports.deleteFile = async (id) => {
    await prisma.file.delete({
        where: {
            id,
        }
    })
}

module.exports.getFileByName = async (name, folderId) => {
    return prisma.file.findMany({
        where: {
            name,
            folderId
        }
    })
}

module.exports.changeFolder = async (id, folderId) => {
    await prisma.file.update({
        where: {
            id,
        },
        data: {
            folderId,
        }
    })
}

module.exports.changeRoute = async (id, relativeRoute) => {
    await prisma.file.update({
        where: {
            id,
        },
        data: {
            relativeRoute,
        }
    })
}

module.exports.changeName = async (id, name) => {
    await prisma.file.update({
        where: {
            id,
        },
        data: {
            name,
        }
    })
}