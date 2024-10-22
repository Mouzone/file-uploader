const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFolder = async (account_id, name) => {
    return prisma.folder.create({
        data: {
            name: name,
            account_id: account_id,
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
    return prisma.account.findUnique({
        where: {
            id: account_id
        },
        include: {
            folders: true
        }
    })
}