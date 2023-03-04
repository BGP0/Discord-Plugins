/**
 * @name MassDelete
 * @author BGP
 * @description Delete as many messages by you as in your current channel's cache
 * @version 1.0.7
 * @source https://github.com/BGP0/Discord-Plugins/blob/main/MassDeletePlugin/MassDelete.plugin.js
 * @updateUrl https://raw.githubusercontent.com/BGP0/Discord-Plugins/main/MassDeletePlugin/MassDelete.plugin.js
 */
const version = Number("1.0.7".replaceAll('.', ''))

// Potential updates to add:
// 1. Log all messages before you delete them
// 2. Don't let user delete messages if they are already being deleted
// 3. Show a progress bar of how many messagess have been deleted
// 4. Give options on the delete button so user can select which messages to preserve etc

var messageCache = []

module.exports = class MassDeletePlugin {
    addButton() {
        // Check if button already added
        if (document.querySelector("#delButton") != null) return

        try {
            const iconStuff = ZeresPluginLibrary.WebpackModules.getByProps('container', 'children', 'toolbar', 'iconWrapper') // button stuff from 1Lighty and fontawesome
            var element = document.createElement('element')
            element.innerHTML = `<div id="delButton" tabindex="0" class="${iconStuff.iconWrapper} ${iconStuff.clickable}" role="button"><svg aria-hidden="true" class="${iconStuff.icon}" name="Open Logs" viewBox="0 0 576 512"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"/></svg></div>`.trim()
            this.channelLogButton = element.firstChild


            this.channelLogButton.addEventListener('click', () => {
                // Dev
                // console.log(messageCache)

                BdApi.showConfirmationModal("Delete messages", `Are you sure you want to delete ${messageCache.length} messages?`, {
                    danger: true,
                    confirmText: "Delete",
                    onConfirm: () => {
                        this.deleteMessages(Array.from(messageCache), ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId())
                    }
                })
            })
            new ZeresPluginLibrary.Tooltip(this.channelLogButton, 'Delete Messages', { side: 'bottom' })

            try {
                const parent = document.querySelector('div[class*="chat-"] div[class*="toolbar-"]')
                const srch = parent.querySelector('div[class*="search-"]')
                parent.insertBefore(this.channelLogButton, srch)
            } catch (_) {
                // This means the current page is not a discord channel
            }

        } catch (err) {
            console.log(err)
        }
    }

	async deleteMessages(messages, channelId) {
		for (let message of messages) {
			console.log("Deleting: " + message.content)
			ZeresPluginLibrary.DiscordModules.MessageActions.deleteMessage(channelId, message.id)
			await new Promise(r => setTimeout(r, 1500))
		}

		BdApi.showToast("Deleted all messages !", {type: "success"})
	}

    messageCacher(event) {
        if (event.type == "LOAD_MESSAGES_SUCCESS" || event.type == "CUSTOM_SWITCH_EVENT") {
            messageCache.push(...event.messages.filter(i => i.author.id == ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id))
            console.log("a", messageCache)
        } else if (event.type == "MESSAGE_CREATE" && event.message.state == "SENDING") {
            messageCache.push(event.message)
        }
    }
    
    load() {
        if (!global.ZeresPluginLibrary) {
            BdApi.showConfirmationModal("Library plugin is needed",
                `ZeresPluginLibrary is missing. Please click Download Now to install it.`, {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    request.get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, _, body) => {
                        if (error) {
                            return electron.shell.openExternal("https://github.com/rauenzi/BDPluginLibrary");
                        }
                        require("fs").writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
                    });
                }
            });
        }

		fetch("https://bgp0.github.io/Discord-Plugins/MassDeletePlugin/MassDelete.plugin.js", {cache: "no-store"}).then(res => res.text()).then(res => {
			let newVersion = Number(res.substring(res.indexOf("version") + 8, res.indexOf("version") + 13).replaceAll('.', ''))
			if (newVersion > version) {
				console.log("UPDATING!")
				require("fs").writeFile(`${BdApi.Plugins.folder}/MassDelete.plugin.js`, res)
			}
		})
    }

    constructor(c) {
        this.config = c
    }

    start() {
        ZeresPluginLibrary.DiscordModules.Dispatcher.subscribe("LOAD_MESSAGES_SUCCESS", this.messageCacher)
        ZeresPluginLibrary.DiscordModules.Dispatcher.subscribe("MESSAGE_CREATE", this.messageCacher)
        this.addButton()
    }
    onSwitch() {
        messageCache = [] // Reset the cache on change channel to minimise memory usage

        // If the channel has already been loaded, the regular event will not be called so lets send our own.
        let messages = ZeresPluginLibrary.DiscordModules.MessageStore.getMessages(ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId())
        if (messages.hasFetched) {
            this.messageCacher({"type": "CUSTOM_SWITCH_EVENT", messages: messages._array})
        }

        // Because the button gets deleted every time you change channel idk how to fix this
        this.addButton()
    }
    stop() {
        ZeresPluginLibrary.DiscordModules.Dispatcher.unsubscribe("LOAD_MESSAGES_SUCCESS", this.messageCacher)
        ZeresPluginLibrary.DiscordModules.Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageCacher)
    }
}
