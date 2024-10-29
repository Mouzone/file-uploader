const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const Account = require("../queries/accountQueries")
const fs = require("fs");
const {getValidName} = require("../utility/getValidName")

module.exports.folderGet = async (req, res) => {
    if (!req.session.passport?.user) {
        res.render("log-in", { errorMessage: ""})
    }
    const folderId = parseInt(req.params.folderId)
    const items = {
        folders: await Folder.getFoldersByParent(folderId),
        files: await File.getFiles(folderId)
    }
    const filePath = []
    let currFolder = folderId
    while (currFolder) {
        const { name, outerFolder } = await Folder.getFolder(currFolder)
        filePath.push([name, currFolder])
        currFolder = outerFolder
    }

    const account = await Account.getUsername(req.session.passport.user)
    res.render("folder", { items, folderId, filePath: filePath.reverse(), account })
}

module.exports.folderUploadPost = async (req, res) => {
    const { filename, size } = req.file
    const folder = await Folder.getFolder(parseInt(req.params.folderId))
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
    const folderId = parseInt(req.params.folderId)
    const name = await getValidName(req.body.name, folderId, "folder")

    const outerFolder = await Folder.getFolder(folderId)
    await Folder.createFolder(
        req.session.passport.user,
        name,
        `${outerFolder.relativeRoute}/${name}`,
        folderId
    )

    // create folder in the directory
    fs.mkdir(`${process.env.UPLOAD_ROOT_PATH}${outerFolder.relativeRoute}/${name}`, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })


    res.redirect(`/folder/${folderId}`)
}

module.exports.folderDeletePost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)


    const folderToDelete = await Folder.getFolder(folderId)
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
            const currFiles = await File.getFiles(folder.id)
            for (const file of currFiles) {
                await File.deleteFile(file.id)
                await fs.promises.unlink(process.env.UPLOAD_ROOT_PATH + file.relativeRoute)
            }

            await Folder.deleteFolder(folder.id)
            await fs.promises.rmdir(process.env.UPLOAD_ROOT_PATH + folder.relativeRoute)
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
    const newFolderId = parseInt(dropTarget.id)
    const newFolder = await Folder.getFolder(newFolderId)

    if (dragTarget.type === "file") {
        const currFileId = parseInt(dragTarget.id)
        const currFile = await File.getFile(currFileId)

        const oldRoute = currFile.relativeRoute
        const newName = await getValidName(currFile.name, newFolderId, "file")
        const newRoute = newFolder.relativeRoute + "/" + newName

        await File.changeName(currFileId, newName)
        await File.changeFolder(currFileId, newFolderId)
        await File.changeRoute(currFileId, newRoute)
        await fs.rename(process.env.UPLOAD_ROOT_PATH + oldRoute, process.env.UPLOAD_ROOT_PATH + newRoute, (error) => {
            if (error) {
                console.error("Error moving file", error)
            }
        })
    } else {
        const currFolderId = parseInt(dragTarget.id)
        const currFolder = await Folder.getFolder(currFolderId)

        const oldRoute = currFolder.relativeRoute
        const newName = await getValidName(currFolder.name, newFolderId, "folder")
        const newRoute =  newFolder.relativeRoute + "/" + newName

        await Folder.changeName(currFolderId, newName)
        await Folder.changeOuterFolder(currFolderId, newFolder.id)
        await Folder.changeRoute(currFolderId, newRoute)

        const toSee = [ await Folder.getFolder(currFolderId) ]
        const foldersToDelete = [ oldRoute ]
        while (toSee.length) {
            const currFolder = toSee.shift()

            fs.mkdir(process.env.UPLOAD_ROOT_PATH + currFolder.relativeRoute, (error) => {
                if (error) {
                    console.error("Error making directory", error)
                }
            })

            const childFiles = await File.getFiles(currFolder.id)
            for (const childFile of childFiles) {
                const oldRoute = childFile.relativeRoute
                const newRoute =  currFolder.relativeRoute + "/" + childFile.name

                await File.changeFolder(childFile.id, currFolder.id)
                await File.changeRoute(childFile.id, newRoute)
                fs.rename(process.env.UPLOAD_ROOT_PATH + oldRoute, process.env.UPLOAD_ROOT_PATH + newRoute, (error) => {
                    if (error) {
                        console.error("Error moving file", error)
                    }
                })
            }

            const childFolders = await Folder.getFoldersByParent(currFolder.id)
            for (const childFolder of childFolders) {
                const oldRoute = childFolder.relativeRoute
                const newRoute =  currFolder.relativeRoute + "/" + childFolder.name

                await Folder.changeOuterFolder(childFolder.id, currFolder.id)
                await Folder.changeRoute(childFolder.id, newRoute)

                foldersToDelete.push(oldRoute)
                toSee.push({...childFolder, relativeRoute: newRoute})
            }

        }

        foldersToDelete.reverse()
        for (const folderPath of foldersToDelete) {
            await fs.rmdir(process.env.UPLOAD_ROOT_PATH + folderPath, (error) => {
                if (error) {
                    console.error("Error removing directory", error)
                }
            })
        }
    }

    res.redirect(`/folder/${req.params.folderId}`)
}