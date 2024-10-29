const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFolder = async (accountId, name, relativeRoute, outerFolder=null) => {
    return prisma.folder.create({
        data: {
            name,
            accountId,
            outerFolder,
            relativeRoute
        }
    })
}

module.exports.deleteFolder = async (id) => {
    await prisma.folder.delete({
        where: {
            id,
        }
    })
}

module.exports.getParentFoldersByAccountId = async (account_id) => {
    return prisma.folder.findMany({
        where: {
            account_id,
            outer_folder: null
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

module.exports.getFoldersByParent = async (outer_folder) => {
    return prisma.folder.findMany({
        where: {
            outer_folder,
        }
    })
}

module.exports.getFolderById = async (id) =>{
    return prisma.folder.findUnique({
        where: {
            id,
        }
    })
}

module.exports.getFolderByName = async (name, outer_folder) => {
    return prisma.folder.findMany({
        where: {
            name,
            outer_folder
        }
    })
}

module.exports.getHomeFolder = async (account_id) => {
    return prisma.folder.findMany({
        where: {
            account_id,
            outer_folder: null
        }
    })
}

module.exports.changeFolderParent = async (id, outer_folder) => {
    await prisma.folder.update({
        where: {
            id,
        },
        data: {
            outer_folder,
        }
    })
}

module.exports.getAllFoldersByAccountId = async (account_id) => {
    return prisma.folder.findMany({
        where: {
            account_id,
        }
    })
}

module.exports.changeFolderRoute = async (id, relative_route) => {
    return prisma.folder.update({
        where: {
            id,
        },
        data: {
            relative_route,
        }
    })
}

module.exports.changeFolderName = async (id, name) => {
    return prisma.folder.update({
        where: {
            id,
        },
        data: {
            name,
        }
    })
}