# ShowTheDocs

ShowTheDocs is a lightweight, client-side documentation viewer that loads documentation content directly from a GitHub repository or a local JSON file. It is designed to be simple to deploy, easy to use, and highly customizable for any open-source or private project documentation.

## Features

- **Fetch documentation from any public GitHub repository** (using the GitHub public API)
- **Supports Markdown** for content rendering
- **Responsive and modern UI**
- **Customizable colors, logo, favicon, and more**
- **Lightbox for images**
- **Search functionality**
- **Graceful error handling**: If the documentation cannot be loaded, a friendly error message is displayed


## Usage

### Loading Documentation from a GitHub Repository

To load documentation from a public GitHub repository, simply add the `repo` parameter to the URL in the following format:

```
https://zonaro.github.io/ShowTheDocs/#/<owner>/<repo>/<branch>
```

**Example:**

```
https://zonaro.github.io/ShowTheDocs/#/zonaro/ShowTheDocs/main
```

- `<owner>`: GitHub username or organization
- `<repo>`: Repository name
- `<branch>`: Branch name (e.g., `main` or `master`)

The app will fetch the `content.json` file and all referenced files from the specified repository and branch using the GitHub public API.
 

## content.json Structure

The `content.json` file defines the structure and content of your documentation. Here is a minimal example:

```json
{
	"title": "My Project Documentation",
	"description": "A simple documentation site.",
	"author": "Your Name",
	"color": "#007bff",
	"logo": "assets/img/logo.png",
	"favicon": "assets/img/favicon.ico",
	"content": [
		{
			"title": "Getting Started",
			"contentfile": "getting_started.md"
		},
		{
			"title": "API Reference",
			"contentfile": "api.md"
		}
	]
}
```

- `contentfile` can be a Markdown file in the repository or a URL.
- You can add more fields for customization (see the sample `content.json`).

---

## Error Handling

If the documentation cannot be loaded (e.g., the repository or file does not exist, or the API rate limit is exceeded), a friendly error message will be displayed on the page. Make sure the repository and files are public and accessible.

---

## Customization

- **Colors**: Set the `color` field in `content.json` for the primary theme color.
- **Logo & Favicon**: Set the `logo` and `favicon` fields.
- **Download Button**: Add a `downloadbutton` field with a URL to enable a download button.
- **Images**: Use the `lightbox` field for image galleries.

 

## Limitations

- Only public repositories are supported (due to GitHub API restrictions).
- GitHub API rate limits apply for unauthenticated requests.
- Private repositories are not supported

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Credits

- [Bootstrap](https://getbootstrap.com/)
- [Highlight.js](https://highlightjs.org/)
- [SimpleLightbox](https://simplelightbox.com/)
- [Marked](https://marked.js.org/)
- [Gumshoe](https://github.com/cferdinandi/gumshoe)

---

## Support

For questions, suggestions, or issues, please open an issue on the repository or contact the maintainer.