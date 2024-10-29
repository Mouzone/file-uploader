const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createUser = async (username, password) => {
    await prisma.account.create({
        data: {
            username,
            password,
        }
    })
}

module.exports.findByUsername = async (username) => {
    return prisma.account.findUnique({
        where: {
            username,
        }
    })
}

module.exports.findById = async (id) => {
    return prisma.account.findUnique({
        where: {
            id,
        }
    })
}

module.exports.getId = async (username) => {
    return prisma.account.findUnique({
        where: {
            username
        },
        select: {
            id: true,
        }
    })
}

module.exports.getUsername = async (id) =>{
    return prisma.account.findUnique({
        where: {
            id,
        }
    })
}