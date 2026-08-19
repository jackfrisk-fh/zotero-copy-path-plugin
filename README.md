# Zotero Copy Path Plugin

A Zotero 7/10 plugin that adds a "Copy Attachment Path" option to the item context menu. It finds the best attachment (PDF, etc.) for the selected item and copies its local file path directly to the clipboard.

## Installation

1. Download the `copy-path-plugin.xpi` file (or build it yourself by zipping the source files).
2. In Zotero, go to **Tools** -> **Add-ons**.
3. Click the Gear icon ⚙️ -> **Install Add-on From File...**
4. Select `copy-path-plugin.xpi`.

## Build from Source

```bash
python3 -c "import zipfile; z = zipfile.ZipFile('copy-path-plugin.xpi', 'w', zipfile.ZIP_DEFLATED); z.write('manifest.json'); z.write('bootstrap.js'); z.write('copy-path.js'); z.close()"
```