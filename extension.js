const vscode = require("vscode");
const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");

/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
	const res = await axios.get("https://blog.webdevsimplified.com/rss.xml");
	const parser = new XMLParser();
	const articles = parser.parse(res.data).rss.channel.item.map((article) => {
		return {
			label: article.title,
			detail: article.description,
			link: article.link
		};
	});

	let disposable = vscode.commands.registerCommand(
		"search-blog-example-js.onlyblogs",
		async function () {
			const article = await vscode.window.showQuickPick(articles, {
				matchOnDetail: true,
			});
			if(article == null) return;

			vscode.env.openExternal(article.link);

			console.log(article);
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
};
