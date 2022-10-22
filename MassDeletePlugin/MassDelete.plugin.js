/**
 * @name MassDelete
 * @author BGP
 * @description Delete as many messages by you as in your current channel's cache
 * @version 1.0.1
 * @source https://github.com/BGP0/Discord-Plugins/blob/main/MassDeletePlugin/MassDelete.plugin.js
 * @updateUrl https://raw.githubusercontent.com/BGP0/Discord-Plugins/main/MassDeletePlugin/MassDelete.plugin.js
 */

module.exports = class MassDeletePlugin {
    addButton() {
        try {
            const iconStuff = ZeresPluginLibrary.WebpackModules.getByProps('container', 'children', 'toolbar', 'iconWrapper') // button stuff from 1Lighty and fontawesome
            var element = document.createElement('element')
            element.innerHTML = `<div tabindex="0" class="${iconStuff.iconWrapper} ${iconStuff.clickable}" role="button"><svg aria-hidden="true" class="${iconStuff.icon}" name="Open Logs" viewBox="0 0 576 512"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"/></svg></div>`.trim()
            this.channelLogButton = element.firstChild

            this.channelLogButton.addEventListener('click', () => {
                const { getMessages } = BdApi.findModuleByProps("getMessage", "getMessages")
                const { getChannelId } = BdApi.findModuleByProps("getLastSelectedChannelId")
                
                // There must be a way to get more messages
                const messages = getMessages(getChannelId()).toArray().reverse()
                var myMessages = []

                for (let message of messages) {
                    if (message.author.phone != null) {
                        myMessages.push(message)
                    }
                }

                BdApi.showConfirmationModal("Delete messages", `Are you sure you want to delete ${myMessages.length} messages?`, {
                    danger: true,
                    confirmText: "Delete",
                    onConfirm: () => {
                        this.deleteMessages(myMessages)
                    }
                })
            })
            new ZeresPluginLibrary.Tooltip(this.channelLogButton, 'Delete Messages', { side: 'bottom' })

            const parent = document.querySelector('div[class*="chat-"] div[class*="toolbar-"]')
            const srch = parent.querySelector('div[class*="search-"]')
            if (parent.children.length <= 7) {
                parent.insertBefore(this.channelLogButton, srch)
            }
        } catch (err) {
            console.log(err)
        }
    }

	async deleteMessages(messages) {
		for (let message of messages.reverse()) {
			console.log("Deleting: " + message.content)
			ZeresPluginLibrary.DiscordModules.MessageActions.deleteMessage(message.channel_id, message.id)
			await new Promise(r => setTimeout(r, 1500))
		}

		BdApi.showToast("Deleted all messages !", {type: "success"})
	}
    
	load() { // Because @updateUrl still isn't implemented and using a zeres library is bloat + requires plugin to be verified
		fetch("https://bgp0.github.io/Discord-Plugins/MassDeletePlugin/MassDelete.plugin.js", {cache: "no-store"}).then(res => res.text()).then(res => {
			let newVersion = Number(res.substring(res.indexOf("version") + 8, res.indexOf("version") + 13).replaceAll('.', ''))
			if (newVersion > version) {
				console.log("UPDATING!")
				fs.writeFile(`${BdApi.Plugins.folder}/MassDelete.plugin.js`, res)
			}
		})
	}

    start() {
        this.addButton()
    }
    onSwitch() {
        this.addButton()
    }
    stop() {}
}