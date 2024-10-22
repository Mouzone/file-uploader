const { expect } = require('chai')
const { createFolder, deleteFolder, getFoldersByAccountId } = require('../queries/folderQueries')
const { PrismaClient } = require('@prisma/client')
const { createUser, getId} = require("../queries/accountQueries");

describe('Query Folder Table', () => {
    const prisma = new PrismaClient()

    it("should create folder in foldertable", async () => {
        await createUser("user", "password")
        const user = await getId("user")
        await createFolder(user.id, "test_folder")

        const result = await prisma.account.findUnique({
            where: {
                id: user.id,
            },
            include: {
                folders: true,
            }
        })

        expect(result.folders.length).to.be.eq(1)
        expect(result.folders[0].name).to.be.eq("test_folder")

        await prisma.folder.delete({
            where: {
                id: result.folders[0].id,
            }
        })

        await prisma.account.delete({
            where: {
                id: user.id,
            }
        })
    })
})