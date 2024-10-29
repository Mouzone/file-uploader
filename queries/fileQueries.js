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

module.exports.getFilesNotInFolders = async (account_id) => {
    return prisma.file.findMany({
        where: {
            account_id,
            folder_id: null,
        }
    })
}

module.exports.getFilesByFolderId = async (folder_id) => {
    return prisma.file.findMany({
        where: {
            folder_id,
        }
    })
}

module.exports.getFileById = async (id) => {
    return prisma.file.findUnique({
        where: {
            id,
        }
    })
}

module.exports.getFileNameById = async (id) => {
    return prisma.file.findUnique({
        where: {
            id,
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

module.exports.getFileByName = async (name, folder_id) => {
    return prisma.file.findMany({
        where: {
            file_name,
            folder_id
        }
    })
}

module.exports.changeFileFolder = async (id, folder_id) => {
    await prisma.file.update({
        where: {
            id,
        },
        data: {
            folder_id,
        }
    })
}

module.exports.changeFileRoute = async (id, relative_route) => {
    await prisma.file.update({
        where: {
            id,
        },
        data: {
            relative_route,
        }
    })
}

module.exports.changeFileName = async (id, name) => {
    await prisma.file.update({
        where: {
            id,
        },
        data: {
            name,
        }
    })
}