const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFile = async (name, size, upload_time, account_id, folder_id, relative_route ) => {
    await prisma.file.create({
        data: {
            name,
            size,
            upload_time,
            account_id,
            folder_id,
            relative_route
        }
    })
}

module.exports.getFilesNotInFolders = async (account_id) => {
    return prisma.file.findMany({
        where: {
            account_id: account_id,
            folder_id: null,
        }
    })
}

module.exports.getFilesByFolderId = async (folder_id) => {
    return prisma.file.findMany({
        where: {
            folder_id: folder_id,
        }
    })
}

module.exports.getFileById = async (file_id) => {
    return prisma.file.findUnique({
        where: {
            id: file_id,
        }
    })
}

module.exports.getFileNameById = async (file_id) => {
    return prisma.file.findUnique({
        where: {
            id: file_id,
        }
    })
}

module.exports.deleteFile = async (file_id) => {
    await prisma.file.delete({
        where: {
            id: file_id,
        }
    })
}

module.exports.getFileByName = async (file_name, folder_id) => {
    return prisma.file.findMany({
        where: {
            name: file_name,
            folder_id
        }
    })
}

module.exports.changeFileFolder = async (file_id, new_folder_id) => {
    await prisma.file.update({
        where: {
            id: file_id,
        },
        data: {
            folder_id: new_folder_id
        }
    })
}

module.exports.changeFileRoute = async (file_id, new_relative_route) => {
    await prisma.file.update({
        where: {
            id: file_id,
        },
        data: {
            relative_route: new_relative_route
        }
    })
}

module.exports.changeFileName = async (file_id, new_name) => {
    await prisma.file.update({
        where: {
            id: file_id,
        },
        data: {
            name: new_name,
        }
    })
}