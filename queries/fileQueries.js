const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.createFile = async (name, size, upload_time, account_id, folder_id = null) => {
    await prisma.file.create({
        data: {
            name,
            size,
            upload_time,
            account_id,
            folder_id,
        }
    })
}