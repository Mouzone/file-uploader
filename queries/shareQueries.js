const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createShare = async (expiration, fileId) => {
    return prisma.share.create({
        data: {
            expiration,
            fileId
        }
    })
}

module.exports.getShare = async (id) =>{
    return prisma.share.findUnique({
        where: {
            id
        }
    })
}

module.exports.deleteShare = async (id) => {
    await prisma.share.delete({
        where: {
            id
        }
    })
}