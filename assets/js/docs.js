// Função para copiar link e exibir toast
function copyLink(el) {
	var link = el.getAttribute('data-copylink');
	var toastText = (window.documentationData && window.documentationData.copytoast) ? window.documentationData.copytoast : 'Copiado!';
	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(link).then(function () {
			showCopyToast(toastText);
		}, function () {
			fallbackCopy(link, el.getAttribute('data-text'));
		});
	} else {
		fallbackCopy(link, el.getAttribute('data-text'));
	}
}

function showCopyToast(text) {
	var toast = document.getElementById('copy-toast');
	if (toast) {
		toast.textContent = text;
		toast.style.display = 'block';
		setTimeout(function () {
			toast.style.display = 'none';
		}, 2000);
	}
}

function fallbackCopy(link, dialogText) {
	// Fallback para prompt/confirm
	window.confirm(dialogText + '\n' + link);
}



const sass = new Sass();

window.location.query = new URLSearchParams(window.location.search);

String.prototype.isBlank = function () { return `${this}`.trim() == ""; }
String.prototype.isNotBlank = function () { return `${this}`.isBlank() == false; }

String.prototype.ifBlank = function (e) { return `${this}`.isBlank() ? (e || "") : `${this}`; }

const absoluteTest = new RegExp('^(?:[a-z]+:)?//', 'i');

String.prototype.isAbsoluteURL = function () {
	return `${this}`.isBlank() == false && absoluteTest.test(`${this}`);
}

String.prototype.isRelativeURL = function () { return `${this}`.isAbsoluteURL() == false; }

location.leftpart = location.origin + location.pathname;

function fixRelativePathRepo(repo, relative) {
	repo = repo || window.repo || "";
	relative = relative || "";
	relative = relative.split(location.leftpart).join("");
	if (relative.isNotBlank() && repo.isNotBlank() && relative.isRelativeURL() && !relative.startsWith("javascript:") && !relative.startsWith("#")) {
		relative = `https://raw.githubusercontent.com/${repo}/${relative}`;
		relative = 'https://' + relative.split("/").filter((i, p) => p > 0 && i != null && i != '').join("/");
		console.log('Changing relative URL to', relative);
	}
	relative = relative.ifBlank("javascript:void(0);");
	return relative;
}



async function getJson(url) {
	try {
		console.log('Getting', url);
		// Se for um arquivo do GitHub, use a API pública
		if (url.includes('raw.githubusercontent.com')) {
			// Converter URL raw para API REST v3
			// Exemplo: https://raw.githubusercontent.com/owner/repo/branch/path -> https://api.github.com/repos/owner/repo/contents/path?ref=branch
			const match = url.match(/https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/);
			if (match) {
				const owner = match[1];
				const repo = match[2];
				const branch = match[3];
				const path = match[4];
				const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
				const response = await fetch(apiUrl, { headers: { 'Accept': 'application/vnd.github.v3.raw' } });
				if (!response.ok) {
					throw new Error('Failed to fetch file from GitHub API.');
				}
				return await response.json();
			}
		}
		// Fallback para fetch normal
		return await fetch(url, { mode: 'cors' }).then(async (response) => await response.json().then(async (json) => await json || {}));
	} catch (error) {
		// Exibir mensagem amigável na página
		showFriendlyError('Could not load documentation data from GitHub. Please check if the repository or file exists and is public.');
		return { 'error': error };
	}
}


async function getText(url, alternateText) {
	console.log('Getting', url);
	try {
		if (url.includes('raw.githubusercontent.com')) {
			const match = url.match(/https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/);
			if (match) {
				const owner = match[1];
				const repo = match[2];
				const branch = match[3];
				const path = match[4];
				const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
				const response = await fetch(apiUrl, { headers: { 'Accept': 'application/vnd.github.v3.raw' } });
				if (!response.ok) {
					throw new Error('Failed to fetch file from GitHub API.');
				}
				return await response.text();
			}
		}
		return await fetch(url, { mode: 'cors' }).then(async (response) => await response.text().then(async (txt) => await txt.ifBlank(alternateText) || ""));
	} catch (error) {
		showFriendlyError('Could not load documentation content from GitHub. Please check if the repository or file exists and is public.');
		return alternateText || '';
	}
}

function showFriendlyError(message) {
	// Remove spinner se existir
	const spinner = document.getElementsByClassName("loadingio-spinner-eclipse-jxj4whxfvsh")[0];
	if (spinner) spinner.remove();
	// Exibe mensagem de erro amigável
	let app = document.getElementById('app');
	if (app) {
		app.innerHTML = `<div style="color: #b94a48; background: #f2dede; border: 1px solid #eed3d7; padding: 2rem; border-radius: 8px; margin: 2rem auto; max-width: 600px; text-align: center; font-size: 1.2rem;">
			<strong>Error:</strong><br>${message}
		</div>`;
	}
}

function parseHTML(html) {
	var el = document.createElement('div');
	el.innerHTML = html;
	return el.childNodes;
}

function getParam(name) {
	return window.location.query.get(name);
}

function getParams(url = window.location) {

	// Create a params object
	let params = {};

	new URL(url).searchParams.forEach(function (val, key) {
		if (params[key] !== undefined) {
			if (!Array.isArray(params[key])) {
				params[key] = [params[key]];
			}
			params[key].push(val);
		} else {
			params[key] = val;
		}
	});

	return params;

}





function stringTemplateParserQuery(expression) {
	const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
	let items = getParams();
	let arr = Object.keys(items);
	let text = expression.replace(templateMatcher, (substring, value, index) => {
		const vv = items[value];
		value = vv || "";
		return value;
	});
	return text;

}




window.search = function (filter, keep) {
	keep = keep || false;
	var root, articles, i, txtValue;
	filter = filter.toUpperCase();
	root = document.getElementById("app");
	articles = root.getElementsByTagName("article");
	for (i = 0; i < articles.length; i++) {
		let article = articles[i];
		txtValue = article.textContent || article.innerText || "";
		var containsSearch = txtValue.toUpperCase().indexOf(filter) > -1;
		var section = article.getElementsByTagName('section')[0];
		var menu = document.getElementById("menu-" + article.id) || document.getElementById("menu-" + section.id);


		article.style.display = '';
		article.style.opacity = 1;
		menu.style.display = '';
		menu.style.opacity = 1;

		if (txtValue != "")
			if (!containsSearch) {
				if (keep) {
					article.style.opacity = 0.1;
					menu.style.opacity = 0.1;
				} else {
					article.style.display = 'none';
					menu.style.display = 'none';
				}
			}
	}
	if (!keep) {
		window.find(filter, false, false, true, false, true, true);
	}

}



/* ===== Responsive Sidebar ====== */
function responsiveSidebar() {
	if (document.getElementById("sidebar-search") != document.activeElement) {

		let sidebar = document.getElementById('docs-sidebar');
		let w = window.innerWidth;

		if (w >= 1200) {
			sidebar.classList.remove('sidebar-hidden');
			sidebar.classList.add('sidebar-visible');
		} else {
			sidebar.classList.remove('sidebar-visible');
			sidebar.classList.add('sidebar-hidden');
		}
	}
};

window.onresize = function () {
	responsiveSidebar();
};



/* ===== MAIN  ====== */
const main = (async function () {

	// Extrai repo e branch do hash ou dos parâmetros
	window.repo = getParam('repo') || '';
	window.basePath = getParam('basePath') || '';
	window.hash = location.hash.substring(1);

	// Suporte a hash duplo: #/repo/branch#ancora
	if (window.hash.isNotBlank()) {
		// Separa repo/branch e ancora interna
		let hashRepo = window.hash;
		let hashAnchor = '';
		if (window.hash.includes('#')) {
			// Exemplo: #/repo/branch#section-1-1
			const split = window.hash.split('#');
			hashRepo = split[0];
			hashAnchor = split.slice(1).join('#');
		}
		if (hashRepo.isNotBlank() && hashRepo.startsWith('/')) {
			// Exemplo: /HES-Informatica/ColetaLeiteDocs/main
			let hashParts = hashRepo.split('/').filter(x => x.isNotBlank());
			if (hashParts.length >= 3) {
				window.repo = `${hashParts[0]}/${hashParts[1]}/${hashParts[2]}`;
				// Se houver algo após o branch, trata como id/hash interno
				if (hashParts.length > 3) {
					window.hash = hashParts.slice(3).join('/');
				} else {
					window.hash = '';
				}
			}
		}
		// Se havia ancora, usa como window.hash
		if (hashAnchor.isNotBlank()) {
			window.hash = hashAnchor;
		}
	}

	// Se repo ainda está vazio, redireciona para padrão
	if (window.repo.isBlank() && window.basePath.isBlank()) {
		location.href = location.leftpart + "#/zonaro/ShowTheDocs/main";
		return;
	}

	// Ajusta repo para garantir 3 partes
	if (window.repo.isNotBlank()) {
		let parts = window.repo.split("/").filter((x) => x.isNotBlank() && x != "#");
		switch (parts.length) {
			case 2:
				parts.push("main");
				break;
			case 1:
				parts = ["zonaro", "showTheDocs", "main"];
				break;
			default:
				parts = parts.slice(0, 3);
				break;
		}
		window.repo = parts.join("/");
		window.basePath = fixRelativePathRepo(window.repo, "content.json");
		console.log('Using GitHub Repo', window.repo);
	}

	if (window.basePath.isBlank()) {
		window.basePath = fixRelativePathRepo(window.repo, "content.json");
	}

	console.log('Documentation Origin', window.basePath);

	var json = await getJson(window.basePath);
	console.log('Documentation Data', json);


	if (json.language) {
		document.querySelector("html").setAttribute("lang", json.language)
	}

	if (json.title) {
		json.title = stringTemplateParserQuery(marked.parseInline(json.title || ""));
		document.querySelector("title").textContent = json.title;
		window.title = json.title;
	}

	if (json.color) {
		var maincolor = document.createElement("style");
		maincolor.textContent = ":root{--bs-primary:" + stringTemplateParserQuery(json.color) + "!important;}";
		document.querySelector("head").appendChild(maincolor);
		console.log("Color", maincolor);
	}

	if (json.author) {
		document.getElementById("author").setAttribute("content", stringTemplateParserQuery(json.author));
	}

	if (json.description) {
		document.getElementById("description").setAttribute("content", stringTemplateParserQuery(json.description));
	}

	if (json.favicon) {
		json.favicon = fixRelativePathRepo(window.repo, json.favicon);
		document.getElementById("favicon").setAttribute("href", stringTemplateParserQuery(json.favicon));
	}

	if (json.logo) {
		json.logo = fixRelativePathRepo(window.repo, json.logo);
	}

	if (json.downloadbutton) {
		json.downloadbutton = fixRelativePathRepo(window.repo, json.downloadbutton);
	}

	if (json.content)
		for (let index = 0; index < json.content.length; index++) {
			let item = json.content[index];


			if (item.contentfile) {
				let filePath = item.contentfile;
				if (window.repo.isNotBlank()) {
					filePath = fixRelativePathRepo(window.repo, item.contentfile);
				} else if (window.basePath.isNotBlank()) {
					// Usa o mesmo diretório do basePath
					try {
						const baseUrl = new URL(window.basePath, location.origin);
						// Remove o nome do arquivo do basePath
						const dir = baseUrl.href.substring(0, baseUrl.href.lastIndexOf("/"));
						filePath = dir + "/" + item.contentfile;
					} catch (e) {
						filePath = item.contentfile;
					}
				}
				item.content = await getText(filePath, item.content);
			}

			if (item.content)
				item.content = stringTemplateParserQuery(marked.parse(item.content || ""));


			if (item.aftercontentfile) {
				item.aftercontentfile = fixRelativePathRepo(window.repo, item.aftercontentfile);
				item.aftercontent = await getText(item.aftercontentfile, item.aftercontent);


			}

			if (item.aftercontent)
				item.aftercontent = stringTemplateParserQuery(marked.parse(item.aftercontent || ""));

			if (item.alerts)
				await item.alerts.forEach(async alert => {
					if (alert.contentfile) {
						alert.contentfile = fixRelativePathRepo(window.repo, alert.contentfile);
						alert.content = await getText(alert.contentfile, alert.content);
					}
					alert.type = alert.type || 'info'
					alert.content = stringTemplateParserQuery(marked.parse(alert.content || ""));
				});



			if (item.lightbox)
				for (let img_index = 0; img_index < item.lightbox.length; img_index++) {
					let img = item.lightbox[img_index];
					img.image = fixRelativePathRepo(window.repo, img.image);

				}


		}

	window.documentationData = json;

	window.vueApp = Vue.createApp({
		mounted: function () {
			this.$nextTick(function () {

				document.querySelectorAll(".search-form").forEach(function (x) {

					x.children[0].addEventListener('keydown', function (event) {
						window.search(this.value, true);
					});

					x.addEventListener('submit', function (event) {
						event.preventDefault();
						window.search(x.children[0].value, false);
					});
				});

				var sidebar = document.getElementById('docs-sidebar');

				responsiveSidebar();

				hljs.initHighlighting();

				if (document.querySelectorAll("#docs-nav a").length > 0) {
					window.spy = new Gumshoe('#docs-nav a', {
						offset: 69 //sticky header height
					});
				}

				/* ===== Smooth scrolling ====== */
				/*  Note: You need to include smoothscroll.min.js (smooth scroll behavior polyfill) on the page to cover some browsers */
				/* Ref: https://github.com/iamdustan/smoothscroll */

				document.querySelectorAll('#docs-sidebar .scrollto').forEach((sidebarLink) => {

					sidebarLink.addEventListener('click', (e) => {

						e.preventDefault();

						var target = sidebarLink.getAttribute("href").replace('#', '');

						document.getElementById(target).scrollIntoView({ behavior: 'smooth' });

						//Collapse sidebar after clicking
						if (sidebar.classList.contains('sidebar-visible') && window.innerWidth < 1200) {
							sidebar.classList.remove('sidebar-visible');
							sidebar.classList.add('sidebar-hidden');
						}

					});

				});

				/* ====== SimpleLightbox Plugin ======= */
				/*  Ref: https://github.com/andreknieriem/simplelightbox */
				const boxes = document.querySelectorAll('[class*="simplelightbox-gallery-"]');
				boxes.forEach(function (box) {
					var classe = "." + box.className.split(" ")[0] + ' a'
					new SimpleLightbox(classe, { /* options */ });
				});

				document.getElementById('docs-sidebar-toggler').addEventListener('click', () => {
					if (sidebar.classList.contains('sidebar-visible')) {

						sidebar.classList.remove('sidebar-visible');
						sidebar.classList.add('sidebar-hidden');

					} else {

						sidebar.classList.remove('sidebar-hidden');
						sidebar.classList.add('sidebar-visible');
					}
				});



				document.querySelector(".docs-content").querySelectorAll('a').forEach(function (element) {
					element.href = fixRelativePathRepo(window.repo, element.href);
				});
				document.querySelector(".docs-content").querySelectorAll('img').forEach(function (element) {
					element.src = fixRelativePathRepo(window.repo, element.src);
				});

				document.getElementsByClassName("loadingio-spinner-eclipse-jxj4whxfvsh")[0].remove();

				setTimeout(function () {
					let scrollinto = document.getElementById(window.hash);
					if (scrollinto) {
						console.log("Scrolling to", scrollinto);
						scrollinto.scrollIntoView({ behavior: 'smooth' });
					}
				}, 500);
			})
		},
		methods: {
			basePath() {
				return window.basePath;
			},
			repo() {
				return window.repo;
			},
			fixRelativePathRepo(url) {
				return fixRelativePathRepo(window.repo, url);
			},
			fixId(id) {
				id = `${id}`.split('.').join("-");
				return id;
			},
			headerType(id) {
				var i = id.split('.').length;
				i = i > 5 ? 5 : i
				i = i < 1 ? 1 : i;
				return `h${i}`;
			},

			createLink(type, id) {
				id = id || "";
				if (id.isNotBlank()) {
					id = `${type}-${id}`
				}
				if (window.repo.isNotBlank()) {
					if (id.isNotBlank())
						return `${location.leftpart}#/${window.repo}#${id}`;
					return `${location.leftpart}#/${window.repo}`;
				} else if (window.basePath.isNotBlank()) {
					if (id.isNotBlank())
						return `${location.leftpart}?basePath=${window.basePath}#${id}`;
					return `${location.leftpart}?basePath=${window.basePath}`;
				}
				return location.href;

			},
			sectionLink(id) {
				return this.createLink('section', id);
			},
			getLabelByType(type) {
				type = (type || 'info').toLowerCase();
				switch (type) {
					case "warning":
						return window.documentationData.warninglabel || "Warning";
					case "danger":
						return window.documentationData.dangerlabel || "Danger";
					case "success":
						return window.documentationData.successlabel || "Success";
					default:
						return window.documentationData.infolabel || "Info";
				}
			},
			getIconByType(type) {
				type = (type || 'info').toLowerCase();
				switch (type) {
					case "warning":
						return "fa fa-solid fa-exclamation-triangle";
					case "danger":
						return "fa fa-solid fa-xmark-circle";
					case "success":
						return "fa fa-solid fa-check-circle";
					default:
						return "fa fa-solid fa-info-circle";

				}
			}
		},
		data() {
			return { data: json };
		}
	});

	window.vueApp.mount('#app');
	return window.vueApp;
})();

















