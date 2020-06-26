import { store } from "../../store.js"
import { doPageUrl } from "../../redux/app/app-actions.js"

export const newMessage = (data) => {

    const alert = new Audio(data.sound)

    const notify = new Notification(data.title, data.options)

    notify.onshow = (e) => {
        alert.play()
    }

    notify.onclick = (e) => {

        let pageUrl = `/app/q-chat/${data.req.url}`
        store.dispatch(doPageUrl(pageUrl))
    }
}
