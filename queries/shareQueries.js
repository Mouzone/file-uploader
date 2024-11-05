const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createShare = (expiration, fileId) => {
    return prisma.share.create({
        data: {
            expiration,
            fileId
        }
    })
}

module.exports.getShare = (fileId) =>{
    prisma.share.findUnique({
        where: {
            fileId
        }
    })
}