/**
 * @name DeveloperExperiments
 * @description Grants access to features for discord staff such as experiments tab
 * @author BGP, CAEC64
 * @version 1.0.6
 * @source https://github.com/BGP0/Discord-Plugins/blob/main/ExperimentsPlugin/DeveloperExperiments.plugin.js
 * @updateUrl https://raw.githubusercontent.com/BGP0/Discord-Plugins/main/ExperimentsPlugin/DeveloperExperiments.plugin.js
 */

function setDev(b) {
	// Current method mostly by me, sets the staff flag and then reloads the developer experiments.
	// Requries no libraries, but idk how to undo it without reloading discord
	// This also has the side effect of giving you the developer badge (client side) in some cases
	window.webpackChunkdiscord_app.push([[ Math.random() ], {}, (req) => { // Weird thing to get loads of webpack data
		var stuff = Object.values(req.c) // We don't care about the keys of the webpack data

		let user = stuff.find(x => x.exports?.default?.getUsers).exports.default.__proto__.getCurrentUser()
		let mall = Object.values(stuff.find(x => x.exports?.Z?._dispatcher).exports?.Z._dispatcher._actionHandlers._dependencyGraph.nodes) // Get a list of all the stores in discord.

		user.flags += b == true ? 1 : -1 // Add/Remove the staff key (2^0)
		mall.find(x => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]() // Open the store with our new key, idk how to close yet
		try {mall.find(x => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user: {flags: 1}})} catch(_) {} // will throw some errors as the function expects more parameters, but it will still let us use buttons even with the exception
	}])
}

module.exports = class {
	start() {
		setDev(1)
	}

	stop() {
		setDev(0)
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
        } else ZeresPluginLibrary.PluginUpdater.checkForUpdate(this.config.name, this.config.version, this.config.updateUrl)
    }

    constructor(c) {
        this.config = c
    }
}