const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFile = async (name, size, uploadTime, accountId, folderId, relativeRoute) => {
    return prisma.file.create({
        data: {
            name,
            size,
            uploadTime,
            relativeRoute,
            account: {
                connect: {
                    id: accountId,
                }
            },
            folder: {
                connect: {
                    id: folderId,
                }
            },
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

module.exports.getFiles = async (folderId) => {
    return prisma.file.findMany({
        where: {
            folderId,
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

module.exports.deleteFile = async (id) => {
    return prisma.file.delete({
        where: {
            id,
        }
    })
}

module.exports.changeFolder = async (id, folderId) => {
    return prisma.file.update({
        where: {
            id,
        },
        data: {
            folderId,
        }
    })
}

module.exports.changeRoute = async (id, relativeRoute) => {
    return prisma.file.update({
        where: {
            id,
        },
        data: {
            relativeRoute,
        }
    })
}

module.exports.changeName = async (id, name) => {
    return prisma.file.update({
        where: {
            id,
        },
        data: {
            name,
        }
    })
}

module.exports.changeShare = async (id, shareId) => {
    return prisma.file.update({
        where: {
            id,
        },
        data: {
            shareId,
        }
    })
}