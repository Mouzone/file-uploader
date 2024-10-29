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

module.exports.getFolder= async (accountId, name) => {
    return prisma.folder.findUnique({
        where: {
            accountId,
            name
        },
        select: {
            id: true
        }
    })
}

module.exports.getFolders = async (outerFolder) => {
    return prisma.folder.findMany({
        where: {
            outerFolder,
        }
    })
}

module.exports.getFolder= async (id) =>{
    return prisma.folder.findUnique({
        where: {
            id,
        }
    })
}

module.exports.getFolderByName = async (name, outerFolder) => {
    return prisma.folder.findMany({
        where: {
            name,
            outerFolder
        }
    })
}

module.exports.getHomeFolder = async (accountId) => {
    return prisma.folder.findMany({
        where: {
            accountId,
            outerFolder: null
        }
    })
}

module.exports.changeOuterFolder = async (id, outerFolder) => {
    await prisma.folder.update({
        where: {
            id,
        },
        data: {
            outerFolder,
        }
    })
}

module.exports.changeRoute = async (id, relativeRoute) => {
    return prisma.folder.update({
        where: {
            id,
        },
        data: {
            relativeRoute,
        }
    })
}

module.exports.changeName = async (id, name) => {
    return prisma.folder.update({
        where: {
            id,
        },
        data: {
            name,
        }
    })
}