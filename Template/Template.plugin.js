/**
 * @name Template
 * @author BGP
 * @description Just a simple template
 * @version 1.0.4
 * @source https://github.com/BGP0/Discord-Plugins/blob/main/Template/Template.plugin.js
 * @updateUrl https://raw.githubusercontent.com/BGP0/Discord-Plugins/main/Template/Template.plugin.js
 */
const version = Number("1.0.4".replaceAll('.', ''))

module.exports = class TemplatePlugin {
    start() {
        console.log("Hello world!")
    }
    stop() {}
    
    load() {
        fetch("https://bgp0.github.io/Discord-Plugins/Template/Template.plugin.js", {cache: "no-store"}).then(res => res.text()).then(res => {
			let newVersion = Number(res.substring(res.indexOf("version") + 8, res.indexOf("version") + 13).replaceAll('.', ''))
			if (newVersion > version) {
				console.log("UPDATING!")
				require("fs").writeFile(`${BdApi.Plugins.folder}/Template.plugin.js`, res)
			}
		})
    }

    constructor(c) {
        this.config = c
    }
}
