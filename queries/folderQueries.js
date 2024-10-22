const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFolder = async (account_id, name, parent=null) => {
    return prisma.folder.create({
        data: {
            name,
            account_id,
            parent
        }
    })
}

module.exports.deleteFolder = async (folder_id) => {
    await prisma.folder.delete({
        where: {
            id: folder_id
        }
    })
}

module.exports.getFoldersByAccountId = async (account_id) => {
    return prisma.folder.findMany({
        where: {
            account_id
        }
    })
}

module.exports.getFolderId = async (account_id, name) => {
    return prisma.folder.findUnique({
        where: {
            account_id,
            name
        },
        select: {
            id: true
        }
    })
}

module.exports.getFoldersByParent = async (parent) => {
    return prisma.folder.findMany({
        where: {
            parent,
        }
    })
}