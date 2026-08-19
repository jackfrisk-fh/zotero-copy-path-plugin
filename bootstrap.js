var CopyPathPlugin;

function log(msg) {
	Zotero.debug("CopyPathPlugin: " + msg);
}

function install() {
	log("Installed");
}

async function startup({ id, version, rootURI }) {
	log("Starting");

	Services.scriptloader.loadSubScript(rootURI + 'copy-path.js');
	CopyPathPlugin.init({ id, version, rootURI });
	CopyPathPlugin.addToAllWindows();
	await CopyPathPlugin.main();
}

function onMainWindowLoad({ window }) {
	CopyPathPlugin.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	CopyPathPlugin.removeFromWindow(window);
}

function shutdown() {
	log("Shutting down");
	CopyPathPlugin.removeFromAllWindows();
	CopyPathPlugin = undefined;
}

function uninstall() {
	log("Uninstalled");
}