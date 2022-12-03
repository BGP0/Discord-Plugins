/**
 * @name Template
 * @author BGP
 * @description Just a template
 * @version 1.0.1
 * @source https://github.com/BGP0/Discord-Plugins/blob/main/Template/Template.plugin.js
 * @updateUrl https://raw.githubusercontent.com/BGP0/Discord-Plugins/main/Template/Template.plugin.js
 */

module.exports = class TemplatePlugin {
    async start() {
        await ZeresPluginLibrary.PluginUpdater.checkForUpdate(this.config.name, this.config.version, this.config.updateUrl)
        console.log("Hello world!")
    }
    stop() {}
    
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
                        fs.writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
                    });
                }
            });
        }
    }

    constructor(c) {
        this.config = c
    }
}
