//ALERTS
const accountCreatedAlert = "Account was added."
const accountAlreadyExistsAlert = "Account already exists."
const noAccountAlert = "Account does not exist."
const noAccountsAlert = "No accounts."
const accountWithLeastSpaceAlert = "Account with least free space:"
const uploadSuccessAlert = "File uploaded into account."
const fileAlreadyExistsAlert = "File already exists in the account."
const fileTooLargeAlert = "File size exceeds account capacity."
const fileSharedAlert = "File was shared."
const noFileAlert = "File does not exist."
const shareNotAllowedAlert = "Account does not allow file sharing."
const fileAlreadySharedAlert = "File already shared."
const fileWasNotSharedAlert = "File not shared."
const displayAllFilesAlert = "Account files:"
const displayAllAccountsAlert = "All accounts:"
const updateSuccessAlert = "File was updated."
const displayLastUpdateAlert = "Last update:"
const exitAlert = "Exiting..."
const invalidCommandAlert = "Invalid command."

//PROMPS
const addPrompt = "ADD: Create a new user account"
const uploadPrompt = "UPLOAD: Add a file to an account"
const sharePrompt = "SHARE: Share a file with another user"
const minspacePrompt = "MINSPACE: Find the account with the least free space"
const listfilesPrompt = "LISTFILES: Display a user's files"
const listallPrompt = "LISTALL: View all registered accounts"
const updatePrompt = "UPDATE: Simulate updating a file"
const lastUpdatePrompt = "LASTUPDATE: Retrieve the account that most recently updated a file"
const exitPrompt = "EXIT: Terminate the application"

const promptMsg = addPrompt+"\n"+uploadPrompt+"\n"+sharePrompt+"\n"+minspacePrompt+"\n"+listfilesPrompt+"\n"+listallPrompt+"\n"+updatePrompt+"\n"+lastUpdatePrompt+"\n"+exitPrompt

function globalState() {
    const accountsDB = [];

    return {
        getAccounts: () => accountsDB,
        addAccount: (account) => {
            accountsDB.push(account)
        },
        addFileToAccount: (account, file) => {
            account.files.push(file);
        },
        updateFile: (account, file, id) => {
            file.updateHistory.push({id, author: account.email})
        }
    }
}

const cloud = globalState()
readPrompt(askPrompt()) 



function askPrompt() {
    return prompt(promptMsg)
}

function extractPrompt(prompt) {
    return prompt ? prompt.split(" ") : readPrompt(askPrompt());
}

function readPrompt(input) {
    const [command, ...data] = extractPrompt(input)

    switch(command) {
        case "ADD": 
            addCommand(data)
            break;
        case "UPLOAD":
            uploadCommand(data)
            break;
        case "SHARE":
            shareCommand(data)
            break;
        case "MINSPACE":
            minspaceCommand()
            break;
        case "LISTFILES":
            listFilesCommand(data)
            break;
        case "LISTALL":
            listAllAccountsCommand()
            break;
        case "UPDATE":
            updateFileCommand(data)
            break;
        case "LASTUPDATE":
            lastUpdateCommand(data)
            break;
        case "EXIT":
            alert(exitAlert);
            alert("");
            return;
        default:
            alert(invalidCommandAlert);
            break;
    }
    readPrompt(askPrompt()) 
}



function getIdNumber() { 
    const allAccounts = cloud.getAccounts() 
    return allAccounts.length > 0 ? getMostRecentRecord(allAccounts).id + 1 : 0 
}

function getAccount(email) {
    const allAccounts = cloud.getAccounts() 
    return allAccounts.find((account) => account.email === email)
}

function addCommand(data) {
    const [accountEmail, accountType] = data 

        if (getAccount(accountEmail)) {
            alert(accountAlreadyExistsAlert)
            alert("")
        } else {
            const newAccount = createNewAccount(accountEmail, accountType, getIdNumber())
            cloud.addAccount(newAccount)

            alert(accountCreatedAlert)
            alert("")
        }
}

function uploadCommand(data) { 
    const [fileOwnerEmail, fileName, fileSize] = data

    const fileOwner = getAccount(fileOwnerEmail); 

    if (!fileOwner) {
        alert(noAccountAlert) 
        alert("")
    } else {
        const uploadCheck = uploadFile(fileName, fileSize, fileOwner)

        if (uploadCheck.error === true) {
            alert(uploadCheck.errorMessage)
            alert("")
        } else {
            alert(uploadSuccessAlert)
            alert("")
        }
    }
}

function shareCommand(data) {
    const [ownerAccountEmail, receivingAccountEmail, sharedFileName] = data

    const ownerAccount = getAccount(ownerAccountEmail)
    const receivingAccount = getAccount(receivingAccountEmail)

    if (!ownerAccount || !receivingAccount) {
        alert(noAccountAlert)
        alert("")
    } else {
        const sharedFile = shareFile(ownerAccount, sharedFileName)
 
        if (sharedFile.error === true) {
            alert(sharedFile.errorMessage)
            alert("")
        } else {
            const fileReceivingCheck = receiveSharedFile(receivingAccount, sharedFile)

            if (fileReceivingCheck.error === true) {
                alert(fileReceivingCheck.errorMessage)
                alert("")
            } else {
                alert(fileSharedAlert)
                alert("")
            }
        }
    }
}

function listAllAccountsCommand() {
    alert(displayAllAccountsAlert+"\n"+displayAllAccounts(cloud.getAccounts()));
    alert("")
}

function listFilesCommand(data) {
    const [filesOwnerEmail] = data
    
    const filesOwner = getAccount(filesOwnerEmail)

    if (!filesOwner) {
        alert(noAccountAlert)
        alert("")
    } else {
        alert(displayAllFilesAlert+"\n"+displayAllFiles(filesOwner));
        alert("")
    }
}

function minspaceCommand() {
    const accountWithLeastSpace = getAccountWithLeastSpace(); 

    if (!accountWithLeastSpace) {
        alert(noAccountsAlert)
        alert("")
    } else {
        alert(accountWithLeastSpaceAlert+" "+accountWithLeastSpace)
        alert("")
    }
}

function lastUpdateCommand(data) {
    const [fileOwnerEmail, fileName] = data

    const fileOwner = getAccount(fileOwnerEmail)

    if (!fileOwner) {
        alert(noAccountAlert);
        alert("")
    } else {
        const lastUpdateAuthor = getLastUpdateAuthor(fileOwner, fileName)

        if (lastUpdateAuthor.error) {
            alert(lastUpdateAuthor.errorMessage)
            alert("")
        } else {
            alert(displayLastUpdateAlert+" "+lastUpdateAuthor)
            alert("")
        }
    }
}

function updateFileCommand(data) {
    const [fileOwnerEmail, updatingAccountEmail, fileName] = data

    const fileOwner = getAccount(fileOwnerEmail);
    const updatingAccount = getAccount(updatingAccountEmail);

    if (!fileOwner || !updatingAccount) {
        alert(noAccountAlert);
        alert("")
    } else if (!accountHasFile(fileOwner, fileName, fileOwner.email)) {
        alert(noFileAlert);
        alert("")
    } else {
        const file = getFileFromOwner(fileOwner, fileName);
        const updateFileCheck = updateFile(updatingAccount, file)

        if (updateFileCheck) {
            alert(updateSuccessAlert)
            alert("")
        } else {
            alert(fileWasNotSharedAlert);
            alert("")
        }
    } 
}

function getAccountWithLeastSpace() { 
    const allAccounts = cloud.getAccounts()

    const accountWithLeastSpace = allAccounts.toSorted((accountA, accountB) => getAccountSpace(accountA) - getAccountSpace(accountB) || accountA.id - accountB.id)
  
    return accountWithLeastSpace.length === 0 ? false : accountWithLeastSpace[0].email
}

function displayAllAccounts(accounts) { 
    const listToDisplay = accounts.map((account) => `${account.email} (${account.type[0].toUpperCase()+account.type.slice(1)})`);
    return listToDisplay.join("\n");
}       



function createNewAccount(email, type, id) {
    const newAccount = {
        email,
        files: [],
        id,
        type
    }

    if (type === "basic") {
        newAccount.space = 2048,
        newAccount.sharedFileWeight = 0.5
    } else if (type === "premium") {
        newAccount.space = 5120,
        newAccount.sharedFileWeight = 0
    }

    return newAccount
}

function uploadFile(fileName, fileSize, fileOwner) {

    if (accountHasFile(fileOwner, fileName, fileOwner.email)) {
        return {error: true, errorMessage: fileAlreadyExistsAlert}
    } else if (checkAvailableSpace(fileOwner, fileSize)) { 
        return {error: true, errorMessage: fileTooLargeAlert}
    } else {
        let file = createNewFile(fileName, fileSize, fileOwner.email)
        cloud.addFileToAccount(fileOwner, file)
        return {error: false}
    }
}

function getFileFromOwner(fileOwner, fileName) {
    const ownFiles = filterOwnFiles(fileOwner)   
    return ownFiles.find((file) => file.name === fileName)
}

function accountHasFile(account, fileName, fileOwnerEmail) { 
    const file = account.files.find((file) => file.name === fileName && file.ownerEmail === fileOwnerEmail)
    return file ? true : false
}

function filterOwnFiles(account) { 
    return account.files.filter((file) => file.ownerEmail === account.email);
}

function filterSharedFiles(account) { 
    return account.files.filter((file) => file.ownerEmail !== account.email);
}

function displayAllFiles(account) {
    const listToDisplay = account.files.map((file) => {
        let shareStatus = ""
        if (file.ownerEmail !== account.email) {
            shareStatus = " (shared)"
        }
        return `${file.name} (${file.size} MB)${shareStatus}`
    })

    return listToDisplay.join("\n");
}

function getAccountSpace(account) {
    const ownWeight = filterOwnFiles(account)
        .reduce((acc, file) => acc + file.size, 0);
    const sharedWeight = filterSharedFiles(account)
        .reduce((acc, file) => acc + calculateSharedFileWeight(file.size, account.sharedFileWeight), 0);

    return account.space - (ownWeight + sharedWeight)
}

function checkAvailableSpace(account, size) {
    return getAccountSpace(account) < size
}   

function shareFile(fileOwnerAccount, sharedFileName) {
    if (fileOwnerAccount.type === "basic") {
        return {error: true, errorMessage: shareNotAllowedAlert}
    } 
    
    const sharedFile = getFileFromOwner(fileOwnerAccount, sharedFileName)

    if (sharedFile) { 
        return sharedFile
    } else {
        return {error: true, errorMessage: noFileAlert} 
    }
}

function receiveSharedFile(receivingAccount, sharedFile) {
    const fileWeight = calculateSharedFileWeight(sharedFile.size, receivingAccount.sharedFileWeight)

    if (accountHasFile(receivingAccount, sharedFile.name, sharedFile.ownerEmail)) { 
        return {error: true, errorMessage: fileAlreadySharedAlert}
    }

    const fileTooLarge = checkAvailableSpace(receivingAccount, fileWeight)
    
    if (fileTooLarge) {
        return {error: true, errorMessage: fileTooLargeAlert}
    } else {
        cloud.addFileToAccount(receivingAccount, sharedFile)
        return {error: false}
    }
}

function updateFile(updatingAccount, file) {
    if (!accountHasFile(updatingAccount, file.name, file.ownerEmail)) {
        return false
    } else {
        updateFileHistory(updatingAccount, file);
        return true
    }
}



function createNewFile(name, size, ownerEmail) {
    return {
        name,
        size: parseFloat(size),
        ownerEmail,
        updateHistory: []
    }
}

function getMostRecentRecord(recordsList) {
    return recordsList.toSorted((recordA, recordB) => recordB.id - recordA.id)[0]
}

function getLastUpdateAuthor(ownerAccount, fileName) {
    const file = getFileFromOwner(ownerAccount, fileName)

    if (!file) {
        return {error: true, errorMessage: noFileAlert}
    }

    const lastUpdate = getMostRecentRecord(file.updateHistory)

    return lastUpdate ? lastUpdate.author : ownerAccount.email
}

function calculateSharedFileWeight(fileSize, sharedFileWeight) {
    return fileSize * sharedFileWeight
}

function updateFileHistory(account, file) {
    const lastUpdate = getMostRecentRecord(file.updateHistory);
    
    let nextId
    lastUpdate ? nextId = lastUpdate.id + 1 : nextId = 0
    
    cloud.updateFile(account, file, nextId)
}



