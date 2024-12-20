const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createUser = async (username, password) => {
    return prisma.account.create({
        data: {
            username,
            password,
        }
    })
}

module.exports.getAccount = async (id) => {
    return prisma.account.findUnique({
        where: {
            id,
        }
    })
}

module.exports.getAccountByUsername = async (username) => {
    return prisma.account.findUnique({
        where: {
            username,
        }
    })
}

module.exports.getIdByUsername = async (username) => {
    return prisma.account.findUnique({
        where: {
            username
        },
        select: {
            id: true,
        }
    })
}