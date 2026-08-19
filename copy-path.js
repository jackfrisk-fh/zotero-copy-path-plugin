CopyPathPlugin = {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],

	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
	},

	log(msg) {
		Zotero.debug("CopyPathPlugin: " + msg);
	},

	addToWindow(window) {
		let doc = window.document;

		// Add menu option to the item context menu
		let menuitem = doc.createXULElement('menuitem');
		menuitem.id = 'copy-path-plugin-menu-item';
		menuitem.setAttribute('label', 'Copy Attachment Path');
		
		menuitem.addEventListener('command', () => {
			this.copyPathForSelectedItem(window);
		});

		// The item context menu in Zotero 7 is 'zotero-itemmenu'
		let itemMenu = doc.getElementById('zotero-itemmenu');
		if (itemMenu) {
			itemMenu.appendChild(menuitem);
			this.storeAddedElement(menuitem);
		} else {
			this.log("Could not find zotero-itemmenu");
		}
	},

	addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.addToWindow(win);
		}
	},

	storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		this.addedElementIDs.push(elem.id);
	},

	removeFromWindow(window) {
		var doc = window.document;
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
	},

	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},

	async copyPathForSelectedItem(window) {
		try {
			let zoteroPane = window.ZoteroPane;
			if (!zoteroPane) return;

			let items = zoteroPane.getSelectedItems();
			if (items.length !== 1) {
				this.log("Please select exactly one item.");
				return;
			}

			let item = items[0];
			let attachmentItem = null;

			if (item.isRegularItem()) {
				attachmentItem = await item.getBestAttachment();
			} else if (item.isAttachment()) {
				attachmentItem = item;
			}

			if (!attachmentItem) {
				this.log("No attachment found for this item.");
				return;
			}

			let filePath = await attachmentItem.getFilePathAsync();

			if (filePath) {
				try {
					if (window.navigator && window.navigator.clipboard) {
						await window.navigator.clipboard.writeText(filePath);
						this.log("Path copied via navigator.clipboard: " + filePath);
					} else {
						// Fallback to Zotero Utilities clipboard copy if navigator isn't available
						var clipboardService = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
						clipboardService.copyString(filePath);
						this.log("Path copied via XPCOM: " + filePath);
					}
				} catch (clipboardErr) {
					this.log("Clipboard API failed, trying XPCOM directly: " + clipboardErr.message);
					var clipboardService = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
					clipboardService.copyString(filePath);
				}
			} else {
				this.log("The attachment does not have a local file path.");
			}
		} catch (e) {
			this.log("Error copying path: " + e.message);
		}
	},

	async main() {
		this.log("CopyPathPlugin is ready.");
	},
};
