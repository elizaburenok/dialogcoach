## Dialog Coach – Employees list

React + Vite + TypeScript project for the employees list UI.

### How to run locally

```bash
npm install
npm run dev
```

### GitHub repository setup

1. **Create a new GitHub repo**  
   - Go to GitHub and create a new repository, for example `dialog-coach-employees`.
   - Do **not** add any files (no README, no `.gitignore`) when creating it.

2. **Initialize Git in this folder (only once)**  
   In the project root (where `package.json` is):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

   Replace `<your-username>` and `<repo-name>` with your actual GitHub username and repository name.

### GitHub Pages (via `docs/` folder)

This project is configured for GitHub Pages using the `docs/` folder on the `main` branch.

1. **Make sure `vite.config.ts` has the correct `base`**

   ```ts
   export default defineConfig({
     base: '/<repo-name>/', // <- must match your repo name
     // ...
   });
   ```

   - Example: if the repo is `dialog-coach-employees`, set `base` to `/dialog-coach-employees/`.
   - If you use a special repository named `your-username.github.io`, then set `base` to `'/'` instead.

2. **Build the site into `docs/`**

   ```bash
   npm run build
   ```

   This will create a `docs/` folder with the production build.

3. **Commit and push the updated build**

   ```bash
   git add .
   git commit -m "Build for GitHub Pages"
   git push
   ```

4. **Enable GitHub Pages**

   - Go to the repository on GitHub.
   - Open **Settings → Pages**.
   - Set:
     - **Source**: `Deploy from a branch`
     - **Branch**: `main` and `/docs` folder.
   - Save the settings.

5. **Open your site**

   After a few minutes, your site will be available at:

   ```text
   https://<your-username>.github.io/<repo-name>/
   ```

### Update the site after changes

Whenever you change the code and want to update GitHub Pages:

```bash
npm run build
git add .
git commit -m "Update site"
git push
```

