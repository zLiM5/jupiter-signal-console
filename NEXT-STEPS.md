# Next Steps

## Done

- Local project created.
- README written.
- DX report written.
- Superteam submission draft written.
- Local git repository initialized.
- First commit created: `Create Jupiter Signal Console submission`.
- Secret scan found no pasted Jupiter API key or wallet address in project files.

## Still Required

### 1. Publish GitHub Repository

The machine is logged in to GitHub as `zLiM5`.

Recommended command after human approval:

```bash
gh repo create jupiter-signal-console --public --source . --remote origin --push
```

Expected repo URL:

```text
https://github.com/zLiM5/jupiter-signal-console
```

### 2. Create Colosseum Project

Open:

```text
https://arena.colosseum.org/signup
```

Create/login to the account, then create a Frontier Hackathon project with:

- Project name: Jupiter Signal Console
- Short description: Read-only Jupiter API token/price signal console and developer-experience report.
- GitHub link: the repo URL above after publishing
- Track/category: Jupiter / Developer Platform if available

### 3. Submit to Superteam

Use:

`SUPERTEAM-SUBMISSION-DRAFT.md`

Required fields:

- Project Title
- Project Description
- Project Github Link
- Feedback doc/markdown file
- Did you submit this project to the official Frontier Hackathon on Colosseum? Yes/No
- Link to your project's Colosseum profile

## Security

The Jupiter API key should not be committed. Use it only as an environment variable:

```powershell
$env:JUPITER_API_KEY="..."
npm run demo
```

After the hackathon submission is complete, consider rotating the key because it was shared in chat.
