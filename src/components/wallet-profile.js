import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import FileSaver from 'file-saver'
import { UPDATE_NAME_STATUSES } from '../redux/user/user-actions.js'

// import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-toast'
import '@polymer/paper-spinner/paper-spinner-lite'

import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import '@material/mwc-textfield'

// import pasteMenu from '../functional-components/paste-menu.js';

class WalletProfile extends connect(store)(LitElement) {
    static get properties() {
        return {
            loggedIn: { type: Boolean },
            config: { type: Object },
            qoraBurnedBalance: { type: String },
            user: { type: Object },
            wallet: { type: Object },
            dialog: { type: Object },
            newName: { type: String },
            nodeConfig: { type: Object },
            accountInfo: { type: Object }
        }
    }

    static get styles() {
        return [
            css`
            `
        ]
    }

    constructor() {
        super()
        this.qoraBurnedBalance = ''
        this.user = {
            accountInfo: {}
        }
        this.nodeConfig = {}
        this.accountInfo = {
            names: [],
            addressInfo: {}
        }
    }

    render() {
        return html`
            <style>
                #profileInMenu {
                    padding:12px;
                    border-bottom: 1px solid #eee;
                }
                #profileInMenu:hover {
                    /* cursor:pointer; */
                }
                #accountIcon {
                    font-size:48px;
                    color: var(--mdc-theme-primary);
                    display: inline-block;
                }
                #accountName {
                    margin: 0;
                    font-size: 18px;
                    font-weight:500;
                    display: inline-block;
                    width:100%;
                    padding-bottom:8px;
                }
                #address {
                    white-space: nowrap; 
                    overflow: hidden;
                    text-overflow: ellipsis;

                    margin:0;
                    margin-top: 0;
                    font-size:12px;
                    /* padding-top:8px; */
                }
                paper-spinner-lite#name-spinner {
                    top: 8px;
                    margin-left:8px;
                    --paper-spinner-stroke-width: 1px;
                    --paper-spinner-color: var(--mdc-theme-secondary)
                }
            </style>


            <div id="profileInMenu">
                <div>
                    <mwc-icon id='accountIcon'>account_circle</mwc-icon>
                </div>
                <div style="padding: 8px 0;">
                    <span id="accountName"
                        title=${this.user.accountInfo.nameStatus !== UPDATE_NAME_STATUSES.LOADED ? '' : ''}
                    >
                        ${this.accountInfo.names.length !== 0 ? this.accountInfo.names[0].name : ''}
                        <mwc-icon-button 
                            style="float:right; top: 0px; margin: -14px;"
                            @click=${() => this.openModalBox()}
                            icon="info"></mwc-icon-button>
                    </span>
                    ${this.accountInfo.addressInfo ? html`<span style="margin-bottom: 8px; display: inline-block;">Account Level - ${this.accountInfo.addressInfo.level} ${this.accountInfo.addressInfo.flags === 1 ? html`<strong>(F)</strong>` : ''}</span>` : ''}
                    <p id="address">${this.wallet.addresses[0].address}</p>
                </div>
            </div>

            <div id="dialogs">
                <style>
                    /* Dialog styles */
                    #dialogAccountIcon {
                        font-size:76px;
                        color: var(--mdc-theme-primary);
                    }

                    h1 {
                        font-weight: 100;
                    }

                    span {
                        font-size: 18px;
                        word-break: break-all;
                    }
                    .title {
                        font-weight:600;
                        font-size:12px;
                        line-height: 32px;
                        opacity: 0.66;
                    }
                    #profileList {
                        padding:0;
                    }
                    #profileList > * {
                        /* padding-left:24px;
                        padding-right:24px; */
                    }
                    #nameDiv:hover, #backupDiv:hover {
                        cursor: pointer;
                    }
                    .red-button {
                        /* --mdc-theme-on-primary: var(--mdc-theme-error); */
                        --mdc-theme-primary: var(--mdc-theme-error);
                    }

                    .modal-patch {
                        opacity: .99
                    }

                    /* mwc-dialog {
                        z-index: 0;
                    } */
                </style>
                <mwc-dialog class="modal-patch" id="profileDialog">
                    <div>
                        <div style="text-align:center">
                            <mwc-icon style="font-size:76px;" id="dialogAccountIcon">account_circle</mwc-icon>
                            <h1>Profile</h1>
                            <hr>
                        </div>
                        <div id="profileList">
                            <span class="title">Address</span>
                            <br>
                            <div><span class="">${this.wallet.addresses[0].address}</span></div>
                            ${this.wallet._walletVersion == 1 ? html`
                                <span class="title">Qora address</span>
                                <br>
                                <div><span class="">${this.wallet.addresses[0].qoraAddress}</span></div>
                                <span class="title">Burned Qora amount</span>
                                <br>
                                <div><span class="">${this.qoraBurnedBalance}</span></div>
                            ` : ''}
                            <span class="title">Public key</span>
                            <br>
                            <div><span class="">${this.wallet.addresses[0].base58PublicKey}</span></div>
                            <div id="backupDiv" style="position:relative;" @click=${() => this.dialogContainer.getElementById('downloadBackupPasswordDialog').show()}>
                                <span class="title">Backup</span>
                                <br>
                                <span class="">Download wallet backup <mwc-icon style="float:right; margin-top:-2px; width:24px; overflow:hidden;">cloud_download</mwc-icon></span>
                                <paper-ripple></paper-ripple>
                                <br>
                            </div>
                        </div>
                    </div>
                    <mwc-button slot="primaryAction" dialogAction="close">Close</mwc-button>
                </mwc-dialog>

                <mwc-dialog id="downloadBackupPasswordDialog" heading="Backup password">
                    <p>
                        Please choose a password to encrypt your backup with (this can be the same as the one you logged in with, or different)
                    </p>
                    <mwc-textfield style="width:100%;" icon="vpn_key" id="downloadBackupPassword" label="Password" type="password" ></mwc-textfield>
                    <mwc-button slot="primaryAction" class="confirm" @click=${() => this.downloadBackup()}>Go</mwc-button>
                    <mwc-button slot="secondaryAction" dialogAction="close" class="red-button">Close</mwc-button>
                </mwc-dialog>>
                
            </div>

            <paper-toast id="toast" horizontal-align="right" vertical-align="top" vertical-offset="64"></paper-toast>

        `
    }

    openModalBox() {
        // Call getBurnedQora
        this.getBurnedQora(this.wallet.addresses[0].address)
    }

    firstUpdated() {


        const container = document.body.querySelector('main-app').shadowRoot.querySelector('app-view').shadowRoot
        const dialogs = this.shadowRoot.getElementById('dialogs')
        this.dialogContainer = container
        container.appendChild(dialogs)
        this.dialog = container.getElementById('profileDialog')

        const toast = this.shadowRoot.getElementById('toast')
        const isMobile = window.matchMedia(`(max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')})`).matches

        if (isMobile) {
            toast.verticalAlign = 'bottom'
            toast.verticalOffset = 0
        }
        this.toast = container.appendChild(toast)
    }

    getBurnedQora(address) {
        const myNode = this.nodeConfig.knownNodes[this.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

        fetch(`${nodeUrl}/addresses/balance/${address}?assetId=1`).then(res => {
            return res.json()
        }).then(data => {
            this.qoraBurnedBalance = data
            this.dialog.show()
        })
    };

    async downloadBackup() {
        const state = store.getState()
        const password = this.dialogContainer.getElementById('downloadBackupPassword').value

        const data = await state.app.wallet.generateSaveWalletData(password, state.config.crypto.kdfThreads, () => { })
        const dataString = JSON.stringify(data)

        const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `qortal_backup_${state.app.selectedAddress.address}.json`)
    }

    stateChanged(state) {
        this.loggedIn = state.app.loggedIn
        this.config = state.config
        this.user = state.user
        this.wallet = state.app.wallet
        this.nodeConfig = state.app.nodeConfig
        this.accountInfo = state.app.accountInfo
    }
}

window.customElements.define('wallet-profile', WalletProfile)
