const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFolder = async (account_id, name, outer_folder=null) => {
    return prisma.folder.create({
        data: {
            name,
            account_id,
            outer_folder
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

module.exports.getFolderById = async (folder_id) =>{
    return prisma.folder.findUnique({
        where: {
            id: folder_id
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
            account_id: account_id,
            outer_folder: null
        }
    })
}

module.exports.changeFolderParent = async (folder_id, new_outer_folder) => {
    await prisma.folder.update({
        where: {
            id: folder_id
        },
        data: {
            outer_folder: new_outer_folder
        }
    })
}

module.exports.getAllFoldersByAccountId = async (account_id) => {
    await prisma.folder.findMany({
        where: {
            account_id,
        }
    })
}