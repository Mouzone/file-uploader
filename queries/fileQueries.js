const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFile = async (original_name, name, size, upload_time, account_id, folder_id = null) => {
    await prisma.file.create({
        data: {
            original_name,
            name,
            size,
            upload_time,
            account_id,
            folder_id,
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