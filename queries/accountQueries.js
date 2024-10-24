const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createUser = async (username, password) => {
    await prisma.account.create({
        data: {
            username: username,
            password: password,
        }
    })
}

module.exports.findByUsername = async (username) => {
    return prisma.account.findUnique({
        where: {
            username: username,
        }
    })
}

module.exports.findById = async (id) => {
    return prisma.account.findUnique({
        where: {
            id: id,
        }
    })
}

module.exports.getId = async (username) => {
    return prisma.account.findUnique({
        where: {
            username: username
        },
        select: {
            id: true,
        }
    })
}

module.exports.getUsername = async (account_id) =>{
    return prisma.account.findUnique({
        where: {
            id: account_id,
        }
    })
}