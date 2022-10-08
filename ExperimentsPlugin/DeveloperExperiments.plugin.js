/**
 * @name DeveloperExperiments
 * @description Grants access to features for discord staff such as experiments tab
 * @author BGP2, CAEC64
 * @version 1.0.0
 * @source https://github.com/BGP0/Discord-Plugins/rawfile
 * @updateUrl https://github.com/BGP0/Discord-Plugins/rawfile
 */

function setDev(b) {
	window.webpackChunkdiscord_app.push([[ Math.random() ], {}, (req) => { // Weird thing to get loads of webpack data
		var stuff = Object.values(req.c) // We don't care about the keys of the webpack data

		let user = stuff.find(x => x.exports?.default?.getUsers).exports.default.__proto__.getCurrentUser()
		let mall = Object.values(stuff.find(x => x.exports?.Z?._dispatcher).exports?.Z._dispatcher._actionHandlers._dependencyGraph.nodes) // Get a list of all the stores in discord.

		user.flags += b == true ? 1 : -1 // Add/Remove the staff key (2^0)
		mall.find(x => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]() // Open the store with our new key, idk how to close yet
	}])
}

module.exports = class {
	start() {
		setDev(1)
	}

	stop() {
		setDev(0)
	}
}
