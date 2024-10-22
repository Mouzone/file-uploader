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

module.exports.deleteFolder = async (account_id, name) => {
    await prisma.folder.delete({
        where: {
            name: name,
            account_id: account_id
        }
    })
}

module.exports.getFolder = async (account_id, name) => {
    return prisma.folder.findUnique({
        where: {
            name: name,
            account_id: account_id,
        }
    })
}

module.exports.getFoldersByAccountId = async (account_id) => {
    return prisma.folder.findMany({
        where: {
            account_id: account_id,
        }
    })
}