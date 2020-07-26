import { store } from '../store.js'
import { doAddPluginUrl, doUpdateBlockInfo, doUpdateNodeStatus, doUpdateNodeInfo, doSetNode, doPageUrl, doSetChatHeads, doUpdateAccountInfo } from '../redux/app/app-actions.js'
import * as api from 'qortal-ui-crypto'
import { requestTransactionDialog } from '../functional-components/confirm-transaction-dialog.js'
import { doNewMessage } from '../notifications/controller.js'
import snackbar from '../functional-components/snackbar.js'
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../localStorageHelpers.js'
import copyTextMenu from '../functional-components/copy-text-menu.js'
import framePasteMenu from '../functional-components/frame-paste-menu.js';


const createTransaction = api.createTransaction
const processTransaction = api.processTransaction
const signChatTransaction = api.signChatTransaction

export const routes = {
    hello: async req => {
        return 'Hello from awesomeness'
    },

    registerUrl: async req => {
        store.dispatch(doAddPluginUrl(req.data))
    },

    setAccountInfo: async req => {
        store.dispatch(doUpdateAccountInfo(req.data))
    },

    getAccountInfo: async req => {
        return store.getState().app.accountInfo
    },

    setChatHeads: async req => {
        return store.dispatch(doSetChatHeads(req.data))
    },

    getChatHeads: async req => {
        return store.getState().app.chatHeads
    },

    updateBlockInfo: async req => {
        store.dispatch(doUpdateBlockInfo(req.data))
    },

    updateNodeStatus: async req => {
        store.dispatch(doUpdateNodeStatus(req.data))
    },

    updateNodeInfo: async req => {
        store.dispatch(doUpdateNodeInfo(req.data))
    },

    setNode: async req => {
        store.dispatch(doSetNode(req.data))
    },

    getNodeConfig: async req => {
        return store.getState().app.nodeConfig
    },

    setPageUrl: async req => {
        return store.dispatch(doPageUrl(req.data))
    },

    getLocalStorage: async req => {
        return loadStateFromLocalStorage(req.data)
    },

    setLocalStorage: async req => {
        return saveStateToLocalStorage(req.data.key, req.data.dataObj)
    },

    openCopyTextMenu: async req => {

        const textMenuObject = {
            selectedText: req.data.selectedText,
            eventObject: req.data.eventObject,
            isFrame: req.data.isFrame
        }
        copyTextMenu.open(textMenuObject)
    },

    closeCopyTextMenu: async req => {
        copyTextMenu.close()
    },

    openFramePasteMenu: async req => {
        framePasteMenu.open(req.data)
    },

    closeFramePasteMenu: async req => {
        framePasteMenu.close()
    },

    apiCall: async req => {
        const url = req.data.url
        delete req.data.url
        return api.request(url, req.data)
    },

    addresses: async req => {
        return store.getState().app.wallet.addresses.map(address => {
            return {
                address: address.address,
                color: address.color,
                nonce: address.nonce,
                textColor: address.textColor,
                base58PublicKey: address.base58PublicKey
            }
        })
    },

    transaction: async req => {
        let response
        try {
            const tx = createTransaction(req.data.type, store.getState().app.wallet._addresses[req.data.nonce].keyPair, req.data.params)
            await requestTransactionDialog.requestTransaction(tx)
            const res = await processTransaction(tx.signedBytes)
            response = {
                success: true,
                data: res
            }
        } catch (e) {
            console.error(e)
            console.error(e.message)
            response = {
                success: false,
                message: e.message
            }
        }
        return response
    },

    username: async req => {
        const state = store.getState()
        const username = state.user.storedWallets[state.app.wallet.addresses[0].address].name

        return username
    },

    chat: async req => {
        let response
        try {
            const tx = createTransaction(req.data.type, store.getState().app.wallet._addresses[req.data.nonce].keyPair, req.data.params)

            response = tx.chatBytes
        } catch (e) {
            console.error(e)
            console.error(e.message)
            response = false
        }
        return response
    },

    sign_chat: async req => {
        let response
        try {
            const signedChatBytes = await signChatTransaction(req.data.chatBytesArray, req.data.chatNonce, store.getState().app.wallet._addresses[req.data.nonce].keyPair)

            const res = await processTransaction(signedChatBytes)
            response = res
        } catch (e) {
            console.error(e)
            console.error(e.message)
            response = false
        }
        return response
    },

    showNotification: async req => {
        doNewMessage(req.data)
    },

    showSnackBar: async req => {
        snackbar.add({
            labelText: req.data,
            dismiss: true
        })
    }
}
