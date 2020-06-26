import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { doSetNode, doPageUrl } from '../redux/app/app-actions.js';

import '@material/mwc-icon';
import '@material/mwc-button'

import snackbar from '../functional-components/snackbar.js'

class AppInfo extends connect(store)(LitElement) {
    static get properties() {
        return {
            blockInfo: { type: Object },
            nodeStatus: { type: Object },
            nodeInfo: { type: Object },
            iconName: { type: String },
            isLoading: { type: Boolean },
            nodeConfig: { type: Object },
            nodeTextName: { type: String },
            slotText: { type: String },
            cssBtn: { type: String },
            cssStatus: { type: String },
            pageUrl: { type: String }
        }
    }

    static get styles() {
        return [
            css`
                /** :host {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                } **/
                * {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --paper-input-container-focus-color: var(--mdc-theme-primary);
                }
                .normal {
                    --mdc-theme-primary: rgb(3, 169, 244);
                }

                .normal-button {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --mdc-theme-on-primary: white;
                }

                mwc-button.normal-button {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --mdc-theme-on-primary: white;
                }
                .test-net {
                    --mdc-theme-primary: black;
                }

                .test-net-button {
                    --mdc-theme-primary: black;
                    --mdc-theme-on-primary: white;
                }

                mwc-button.test-net-button {
                    --mdc-theme-primary: black;
                    --mdc-theme-on-primary: white;
                }
                #profileInMenu {
                    padding:12px;
                    border-top: 1px solid #eee;
                    position: fixed;
                    top: 98vh;
                    left: 0;
                    /* margin-top: 2.5rem; */
                }
                .info {
                    margin: 0;
                    font-size: 14px;
                    font-weight:100;
                    display: inline-block;
                    width:100%;
                    padding-bottom:8px;
                }
                .green {
                    color: green;
                    margin: 0;
                    font-size: 14px;
                    font-weight:200;
                    display: inline;
                }
                .black {
                    color: black;
                    margin: 0;
                    font-size: 14px;
                    font-weight:200;
                    display: inline;
                }
            `
        ]
    }

    constructor() {
        super()
        this.blockInfo = {}
        this.nodeInfo = {}
        this.nodeStatus = {}
        this.iconName = 'compare_arrows'
        this.isLoading = false
        this.nodeTextName = "Main-Net"
        this.slotText = "secondaryAction"
        this.cssBtn = "normal"
        this.cssStatus = ""
        this.pageUrl = ""
    }

    render() {
        return html`
            <div id="profileInMenu">

                <div>
                    <mwc-button slot=${this.slotText} class=${this.cssBtn} ?disabled=${this.isLoading} @click=${() => this.switchNodes()}><mwc-icon>${this.iconName}</mwc-icon>Switch to ${this.nodeTextName}</mwc-button>
                </div>
                <span class="info">Block Height: ${this.blockInfo.height ? this.blockInfo.height : ""}  <span class=${this.cssStatus}>${this._renderStatus()}</span></span>
                <span class="info">UI Version: ${this.nodeConfig.version ? this.nodeConfig.version : ""} </span>
                <span class="info">Core Version: ${this.nodeInfo.buildVersion ? this.nodeInfo.buildVersion : ""} </span>
                <a id="pageLink"></a>
            </div>

        `
    }

    firstUpdated() {
        // ...
    }

    _renderStatus() {
        if (this.nodeStatus.isMintingPossible === true && this.nodeStatus.isSynchronizing === true) {
            this.cssStatus = "green"
            return "(Minting)"
        } else if (this.nodeStatus.isMintingPossible === true && this.nodeStatus.isSynchronizing === false) {
            this.cssStatus = "green"
            return "(Minting)"
        } else if (this.nodeStatus.isMintingPossible === false && this.nodeStatus.isSynchronizing === true) {
            this.cssStatus = "black"
            return `(Synchronizing... ${this.nodeStatus.syncPercent !== undefined ? this.nodeStatus.syncPercent + "%" : ""})`
        } else if (this.nodeStatus.isMintingPossible === false && this.nodeStatus.isSynchronizing === false) {
            this.cssStatus = "black"
            return ""
        } else {
            return ""
        }
    }

    switchNodes() {
        this.isLoading = true
        if (this.nodeConfig.node === 1) {
            this.cssBtn = "test-net"
            store.dispatch(doSetNode(0))
            this.nodeTextName = "Main-Net"
            this.slotText = "primaryAction"
            this.isLoading = false
            snackbar.add({
                labelText: 'Successfully Switched to Test-Net',
                dismiss: true
            })
        } else {
            this.cssBtn = "normal"
            store.dispatch(doSetNode(1))
            this.nodeTextName = "Test-Net"
            this.slotText = "secondaryAction"
            this.isLoading = false
            snackbar.add({
                labelText: 'Successfully Switched to Main-Net',
                dismiss: true
            })
        }
    }

    gotoPage(url) {

        let myLink = this.shadowRoot.querySelector('#pageLink')
        myLink.href = url
        myLink.click()
        store.dispatch(doPageUrl(''))
    }

    stateChanged(state) {
        this.blockInfo = state.app.blockInfo
        this.nodeStatus = state.app.nodeStatus
        this.nodeInfo = state.app.nodeInfo
        this.nodeConfig = state.app.nodeConfig

        this.pageUrl = state.app.pageUrl
        if (this.pageUrl.length > 5) {
            this.gotoPage(this.pageUrl)
        }

    }
}

window.customElements.define('app-info', AppInfo)
