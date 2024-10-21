const { expect } = require('chai')
const { createUser } = require('../queries/accountQueries')
const { PrismaClient } = require('@prisma/client')

describe('Query Account Table', () => {
    const prisma = new PrismaClient()

    it ("should successfully insert into Account table", async () => {
        await createUser("user", "password")

        const query = { where: { username: "user" } }
        const result = await prisma.account.findUnique(query)
        expect(result).to.include({
            username: "user",
            password: "password"
        })

        await prisma.account.delete(query)
    })
})