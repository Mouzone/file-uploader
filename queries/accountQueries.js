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