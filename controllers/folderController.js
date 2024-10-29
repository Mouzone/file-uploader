const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const Account = require("../queries/accountQueries")
const fs = require("fs");
const {getFolderById} = require("../queries/folderQueries");
const {getFileById} = require("../queries/fileQueries");
const {getValidName} = require("../utility/getValidName")

module.exports.folderGet = async (req, res) => {
    if (!req.session.passport?.user) {
        res.render("log-in", { errorMessage: ""})
    }
    const folderId = parseInt(req.params.folderId)
    const items = {
        folders: await Folder.getFoldersByParent(folderId),
        files: await File.getFilesByFolderId(folderId)
    }
    const filePath = []
    let currFolder = folderId
    while (currFolder) {
        const { name, outerFolder } = await Folder.getFolderById(currFolder)
        filePath.push([name, currFolder])
        currFolder = outerFolder
    }

    const account = await Account.getUsername(req.session.passport.user)
    res.render("folder", { items, folderId, filePath: filePath.reverse(), account })
}

module.exports.folderUploadPost = async (req, res) => {
    const { filename, size } = req.file
    const folder = await Folder.getFolderById(parseInt(req.params.folderId))
    await File.createFile(
        filename,
        size,
        new Date(),
        req.session.passport.user,
        parseInt(req.params.folderId),
        `${folder.relativeRoute}/${filename}`
    )
    res.redirect(`/folder/${req.params.folderId}`)
}

module.exports.folderCreateFolderPost = async (req, res) => {
    const rootPath = "./public/data/uploads"
    const folderId = parseInt(req.params.folderId)
    const name = await getValidName(req.body.name, folderId, "folder")

    const outerFolder = await Folder.getFolderById(folderId)
    await Folder.createFolder(
        req.session.passport.user,
        name,
        `${outerFolder.relativeRoute}/${name}`,
        folderId
    )

    // create folder in the directory
    fs.mkdir(`${rootPath}${outerFolder.relativeRoute}/${name}`, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })


    res.redirect(`/folder/${folderId}`)
}

module.exports.folderDeletePost = async (req, res) => {
    const rootPath = `./public/data/uploads`
    const folderId = parseInt(req.params.folderId)


    const folderToDelete = await Folder.getFolderById(folderId)
    const allChildFolders = [ folderToDelete ]
    const toSee = [ folderToDelete ]
    while (toSee.length) {
        const currFolder = toSee.shift()
        const childFolders = await Folder.getFoldersByParent(currFolder.id)

        childFolders.forEach(childFolder => {
            allChildFolders.push(childFolder)
            toSee.push(childFolder)
        })
    }

    for (const folder of [...allChildFolders].reverse()) {
        try {
            const currFiles = await File.getFilesByFolderId(folder.id)
            for (const file of currFiles) {
                await File.deleteFile(file.id)
                await fs.promises.unlink(rootPath + file.relativeRoute)
            }

            await Folder.deleteFolder(folder.id)
            await fs.promises.rmdir(rootPath + folder.relativeRoute)
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    }

    folderToDelete.outerFolder
        ? res.redirect(`/folder/${folderToDelete.outerFolder}`)
        : res.redirect(`/`)
}

module.exports.folderMovePost = async (req, res) => {
    const { dragTarget, dropTarget } = req.body
    const rootPath = `./public/data/uploads`
    const newFolderId = parseInt(dropTarget.id)
    const newFolder = await getFolderById(newFolderId)

    if (dragTarget.type === "file") {
        const currFileId = parseInt(dragTarget.id)
        const currFile = await getFileById(currFileId)

        const oldRoute = currFile.relativeRoute
        const newName = await getValidName(currFile.name, newFolderId, "file")
        const newRoute = newFolder.relativeRoute + "/" + newName

        await File.changeFileName(currFileId, newName)
        await File.changeFileFolder(currFileId, newFolderId)
        await File.changeFileRoute(currFileId, newRoute)
        await fs.rename(rootPath + oldRoute, rootPath + newRoute, (error) => {
            if (error) {
                console.error("Error moving file", error)
            }
        })
    } else {
        const currFolderId = parseInt(dragTarget.id)
        const currFolder = await getFolderById(currFolderId)

        const oldRoute = currFolder.relativeRoute
        const newName = await getValidName(currFolder.name, newFolderId, "folder")
        const newRoute =  newFolder.relativeRoute + "/" + newName

        await Folder.changeFolderName(currFolderId, newName)
        await Folder.changeFolderParent(currFolderId, newFolder.id)
        await Folder.changeFolderRoute(currFolderId, newRoute)

        const toSee = [ await getFolderById(currFolderId) ]
        const foldersToDelete = [ oldRoute ]
        while (toSee.length) {
            const currFolder = toSee.shift()

            fs.mkdir(rootPath + currFolder.relativeRoute, (error) => {
                if (error) {
                    console.error("Error making directory", error)
                }
            })

            const childFiles = await File.getFilesByFolderId(currFolder.id)
            for (const childFile of childFiles) {
                const oldRoute = childFile.relativeRoute
                const newRoute =  currFolder.relativeRoute + "/" + childFile.name

                await File.changeFileFolder(childFile.id, currFolder.id)
                await File.changeFileRoute(childFile.id, newRoute)
                fs.rename(rootPath + oldRoute, rootPath + newRoute, (error) => {
                    if (error) {
                        console.error("Error moving file", error)
                    }
                })
            }

            const childFolders = await Folder.getFoldersByParent(currFolder.id)
            for (const childFolder of childFolders) {
                const oldRoute = childFolder.relativeRoute
                const newRoute =  currFolder.relativeRoute + "/" + childFolder.name

                await Folder.changeFolderParent(childFolder.id, currFolder.id)
                await Folder.changeFolderRoute(childFolder.id, newRoute)

                foldersToDelete.push(oldRoute)
                toSee.push({...childFolder, relativeRoute: newRoute})
            }

        }

        foldersToDelete.reverse()
        for (const folderPath of foldersToDelete) {
            await fs.rmdir(rootPath + folderPath, (error) => {
                if (error) {
                    console.error("Error removing directory", error)
                }
            })
        }
    }

    res.redirect(`/folder/${req.params.folderId}`)
}