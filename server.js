import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

async function fetchGitHubData(username) {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
    ])
    
    return {
      user: userResponse.data,
      repos: reposResponse.data
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error.message)
    return {
      user: {},
      repos: []
    }
  }
}

app.get('/', async (req, res) => {
  try {
    const githubData = await fetchGitHubData('KazeDevID')
    
    const userData = {
      name: githubData.user.name || 'Kaze',
      username: githubData.user.login || 'KazeDevID',
      avatar: githubData.user.avatar_url,
      bio: githubData.user.bio || 'Developer & Programmer',
      followers: githubData.user.followers,
      following: githubData.user.following,
      publicRepos: githubData.user.public_repos,
      location: githubData.user.location,
      repos: githubData.repos.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description provided',
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language
      }))
    }
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).send('Server Error')
  }
})

app.get('/api/github-data', async (req, res) => {
  try {
    const githubData = await fetchGitHubData('KazeDevID')
    res.json(githubData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})