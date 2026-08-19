
# Struc_Eng_Library_Website

This website is built with [ProperDocs](https://properdocs.org/) and the [MaterialX theme](https://jaywhj.github.io/mkdocs-materialx/). A [GitHub Actions workflow](https://github.com/StrucEng-Library-kfmresearch/strucenglib-website/actions/workflows/deploy.yml) redeploys the website after a commit to `master`.


## Files and Directories
```
./docs..........: Markdown files
./docs/assets...: Static assets (images)
./properdocs.yml: ProperDocs configuration and website navigation
```

## Edit website 
The navigation hierarchy is changed in [properdocs.yml](properdocs.yml). It resembles the file structure in the [./docs](./docs) folder.

<p align="left">
<img src="https://user-images.githubusercontent.com/2311941/196964646-1871193b-8af9-4129-94d0-f02bd015379e.png" alt="strucenglib" width="400"/>
</p>

In the example image above, the navigation entry `See in Action` serves the file `action.md`.

## Edit a Page
The content pages are written in markdown and are available in the [./docs](./docs) folder.
Edit a Markdown file in the GitHub file editor. Changes are redeployed after a commit to `master`. Deployment status is shown under [GitHub Actions](https://github.com/StrucEng-Library-kfmresearch/strucenglib-website/actions).



<p align="left">
<img src="https://user-images.githubusercontent.com/2311941/196965370-33f40404-eb83-4015-a1c6-c1cc770aa6ff.png" alt="strucenglib" width="400"/>
</p>


## Markdown Documentation
ProperDocs uses Python-Markdown. See [Writing your docs](https://properdocs.org/user-guide/writing-your-docs/) and the [MaterialX documentation](https://jaywhj.github.io/mkdocs-materialx/).


## Developer Notes
### Local Build
If you prefer to edit the website locally without Github's UI, execute the following commands.

Install python 3 and pip.

```sh

# 1. create new virtual environment (optional)

# 2. Open a terminal and change to the cloned strucenglib-website directory.

# 3. install dependencies
pip install -r ./.github/requirements.txt

# 4. serve content
properdocs serve

# 5. Merge/Push in Master

```

## Runners
- Build Website: Builds ProperDocs and publishes the result to the GitHub Pages branch
- pages-build-deployment: Pushes github pages to server
