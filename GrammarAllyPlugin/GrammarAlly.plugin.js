/**
 * @name GrammarAlly
 * @author CAEC
 * @description This got my friend his "PhD in trolling"
 * @version 1.0.5
 * @source https://github.com/BGP0/Discord-Plugins/blob/main/GrammarAlly/GrammarAlly.plugin.js
 * @updateUrl https://raw.githubusercontent.com/BGP0/Discord-Plugins/main/GrammarAlly/GrammarAlly.plugin.js
 */
const version = Number("1.0.5".replaceAll('.', ''))

module.exports = class GrammarAllyPlugin {
    start() {
        // Not sure if this is the best way to do this but it seems to work for me
        this.messageModule = BdApi.findModuleByProps("sendMessage")
        this.vanillaSendMessage = this.messageModule.sendMessage

        this.messageModule.sendMessage = (channelId, message, a, b) => {
            message.content = this.transformMessage(message.content)
            this.vanillaSendMessage(channelId, message, a, b)
        }
    }

    stop() {
        this.messageModule.sendMessage = this.vanillaSendMessage
    }
    
    load() {
        if (!global.ZeresPluginLibrary) {
            BdApi.showConfirmationModal("Library plugin is needed",
                `ZeresPluginLibrary is missing. Please click Download Now to install it.`, {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    request.get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, response, body) => {
                        if (error) {
                            return electron.shell.openExternal("https://github.com/rauenzi/BDPluginLibrary");
                        }
                        require("fs").writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
                    });
                }
            });
        }
		fetch("https://bgp0.github.io/Discord-Plugins/GrammarAllyPlugin/GrammarAlly.plugin.js", {cache: "no-store"}).then(res => res.text()).then(res => {
			let newVersion = Number(res.substring(res.indexOf("version") + 8, res.indexOf("version") + 13).replaceAll('.', ''))
			if (newVersion > version) {
				console.log("UPDATING!")
				require("fs").writeFile(`${BdApi.Plugins.folder}/GrammarAlly.plugin.js`, res)
			}
		})
    }

    constructor(c) {
        this.config = c
        this.settings = ZeresPluginLibrary.PluginUtilities.loadSettings(this.config.name, {
            "commonMistakes": false,
            "randomlyRemoveCharacters": 0,
            "randomlyRemoveWords": 0,
            "randomlyDoubleCharacters": 0,
            "randomlyDoubleWords": 0,
            "basicUwUifier": false,
            "randomToggleCase": 0,
            "randomSwapChars": 0.2
        })
    }

    getSettingsPanel() {
		return ZeresPluginLibrary.Settings.SettingPanel.build(
			() => {
                // Save when a setting is edited
                ZeresPluginLibrary.PluginUtilities.saveSettings(this.config.name, this.settings)

			},
			new ZeresPluginLibrary.Settings.Switch(
				"Common Mistakes",
				"Make some mistakes like you're --> your",
				this.settings.commonMistakes,
				(v) => { this.settings.commonMistakes = v }
			),
            new ZeresPluginLibrary.Settings.Switch(
                "Basic UwUifier",
                "",
                this.settings.basicUwUifier,
                (v) => { this.settings.basicUwUifier = v }
            ),
            new ZeresPluginLibrary.Settings.Slider(
                "Randomly Remove Characters",
                "",
                0, 1, this.settings.randomlyRemoveCharacters,
                (v) => { this.settings.randomlyRemoveCharacters = v }
            ),
            new ZeresPluginLibrary.Settings.Slider(
                "Randomly Remove Words",
                "",
                0, 1, this.settings.randomlyRemoveWords,
                (v) => { this.settings.randomlyRemoveWords = v }
            ),
            new ZeresPluginLibrary.Settings.Slider(
                "Randomly Double Characters",
                "",
                0, 1, this.settings.randomlyDoubleCharacters,
                (v) => { this.settings.randomlyDoubleCharacters = v }
            ),
            new ZeresPluginLibrary.Settings.Slider(
                "Randomly Double Words",
                "",
                0, 1, this.settings.randomlyDoubleWords,
                (v) => { this.settings.randomlyDoubleWords = v }
            ),
            new ZeresPluginLibrary.Settings.Slider(
                "Randomly Toggle Case",
                "",
                0, 1, this.settings.randomToggleCase,
                (v) => { this.settings.randomToggleCase = v }
            ),
            new ZeresPluginLibrary.Settings.Slider(
                "Randomly Swap Chars",
                "",
                0, 1, this.settings.randomSwapChars,
                (v) => { this.settings.randomSwapChars = v }
            ),
		)
	}

    transformMessage(message) {
        let start = Date.now()

        message = message.split(' ').map(word => {
            // Ignore links and emojis because we don't want to mess them up
            if (word.includes(':')) return word
            
            // commonMistakes lol this code is awful
            if (this.settings.commonMistakes) [["your", "you're"], ["their", "there"], ["much", "many"], ["then", "than"], ["too", "to"], ["lose", "loose"], ["peak", "peek"], ["affect", "effect"], ["affected", "effected"], ["but", "butt"], ["its", "it's"], ["a lot", "alot"]].forEach(mistake => {
                if (word == mistake[0]) word = mistake[1]
                else if (word == mistake[1]) word = mistake[0]
            })

            // UwUifier
            if (this.settings.basicUwUifier) [["ove", "uv"], ["the", "da"], ["is", "ish"], ['r', 'w'], ["ve", 'v'], ['l', 'w']].forEach(i => word = word.replaceAll(i[0], i[1]))

            // Randomly remove and double characters and words and swap characters
            word = word.split('').map((element, index, array) => {
                if (Math.random() < this.settings.randomSwapChars && index < array.length - 1) {
                    let t = array[index + 1]
                    array[index + 1] = element
                    element = t
                }

                return element
            }).join('')
            if (Math.random() < this.settings.randomlyRemoveWords) word = ''
            if (Math.random() < this.settings.randomlyDoubleWords) word = word + ' ' + word
            word = word.split('').filter(i => Math.random() > this.settings.randomlyRemoveCharacters).join('')
            word = word.split('').map(i => Math.random() < this.settings.randomlyDoubleCharacters ? (i + i) : i).join('')

            // Toggle case, maybe in future add options for toggling by word/char/both
            word = word.split('').map(i => Math.random() < this.settings.randomToggleCase ? (i.toLowerCase() == i ? i.toUpperCase() : i.toLowerCase()) : i).join('')

            return word
        }).join(' ')
        
        console.log("Transformed in " + (Date.now() - start).toString() + "ms")

        return message
    }
}
