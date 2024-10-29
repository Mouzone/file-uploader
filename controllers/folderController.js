const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const Account = require("../queries/accountQueries")
const fs = require("fs");
const {getValidName} = require("../utility/getValidName")
const {getItems, getFolderPath} = require("../utility/folderGet.utility");
const {getChildFolders, deleteFolder} = require("../utility/folderDelete.utility")

module.exports.folderGet = async (req, res) => {
    if (!req.session.passport?.user) {
        return res.render("log-in", { errorMessage: ""})
    }

    const folderId = parseInt(req.params.folderId)
    const { username } = await Account.getUsername(req.session.passport.user)
    const filePath = await getFolderPath(folderId)
    const items = await getItems(folderId)

    res.render("folder", { folderId, username, filePath, items })
}

module.exports.folderUploadPost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)

    const { filename, size } = req.file
    const { relativeRoute } = await Folder.getFolder(folderId)

    await File.createFile(
        filename,
        size,
        new Date(),
        req.session.passport.user,
        folderId,
        `${relativeRoute}/${filename}`
    )
    res.redirect(`/folder/${folderId}`)
}

module.exports.folderCreateFolderPost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)
    const name = await getValidName(req.body.name, folderId, "folder")

    // new route is just outer folder route + current name
    const { relativeRoute } = await Folder.getFolder(folderId)
    await Folder.createFolder(
        req.session.passport.user,
        name,
        `${relativeRoute}/${name}`,
        folderId
    )

    // create folder in the directory
    const newDirectoryPath = `${process.env.UPLOAD_ROOT_PATH}${relativeRoute}/${name}`
    fs.mkdir(newDirectoryPath, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })

    res.redirect(`/folder/${folderId}`)
}

module.exports.folderDeletePost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)

    // get every folder that is nested in folderToDelete from parent to leaf
    const folderToDelete = await Folder.getFolder(folderId)
    const childFolders = await getChildFolders(folderToDelete)
    childFolders.reverse()

    // delete every nested folder, in order from leaf to parent
    for (const folder of childFolders) {
        try {
            await deleteFolder(folder.id, folder.relativeRoute)
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    }

    res.redirect(`/folder/${folderToDelete.outerFolder}`)
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

            const childFolders = await Folder.getFolders(currFolder.id)
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