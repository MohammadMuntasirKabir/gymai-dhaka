# Deployment Instructions

The project is committed locally on branch `main`. To deploy to GitHub and GitLab:

## Step 1: Create repositories

Create two empty repositories (do NOT initialize with README):

- **GitHub**: https://github.com/new — name it `gymai-dhaka`
- **GitLab**: https://gitlab.com/projects/new — name it `gymai-dhaka`

## Step 2: Add remotes and push

Run these commands from `/home/rownak/projects/ai-gym-planner`:

```bash
# Replace YOUR_USERNAME with your actual GitHub/GitLab username

# GitHub
git remote add github git@github.com:YOUR_USERNAME/gymai-dhaka.git
git push -u github main

# GitLab
git remote add gitlab git@gitlab.com:YOUR_USERNAME/gymai-dhaka.git
git push -u gitlab main
```

## Alternative: HTTPS

If you prefer HTTPS over SSH:

```bash
git remote add github https://github.com/YOUR_USERNAME/gymai-dhaka.git
git remote add gitlab https://gitlab.com/YOUR_USERNAME/gymai-dhaka.git
git push -u github main
git push -u gitlab main
```

## Environment Variables for Production

Don't forget to set these in your deployment platform:

### Frontend
- `VITE_NEON_AUTH_URL` — Your Neon Auth endpoint

### Backend
- `DATABASE_URL` — Neon PostgreSQL connection string
- `OPEN_ROUTER_KEY` — OpenRouter API key
- `CLIENT_URL` — Your deployed frontend URL
- `BASE_URL` — Your deployed backend URL
- `PORT` — Server port (default: 3001)
