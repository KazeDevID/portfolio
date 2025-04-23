document.addEventListener('DOMContentLoaded', function() {
  const currentYearElement = document.getElementById('current-year')
  currentYearElement.textContent = new Date().getFullYear()

  const hamburgerMenu = document.querySelector('.hamburger')
  const navigationLinks = document.querySelector('.nav-links')

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active')
      navigationLinks.classList.toggle('active')
    })
  }

  const navigationItems = document.querySelectorAll('.nav-links a')

  navigationItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerMenu.classList.remove('active')
      navigationLinks.classList.remove('active')
    })
  })

  const headerElement = document.querySelector('header')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerElement.classList.add('scrolled')
    } else {
      headerElement.classList.remove('scrolled')
    }
  })

  const sections = document.querySelectorAll('section')

  window.addEventListener('scroll', () => {
    let currentSection = ''

    sections.forEach(section => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        currentSection = section.getAttribute('id')
      }
    })

    navigationItems.forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active')
      }
    })
  })

  const contactForm = document.getElementById('contact-form')

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault()
      alert('Thank you for your message! This is a demo site, so the message will not be sent.')
      contactForm.reset()
    })
  }

  fetchGitHubData()
})

async function fetchGitHubData() {
  try {
    const response = await fetch('/api/github-data')
    const data = await response.json()

    if (data && data.user) {
      updateUserInfo(data.user)
    }

    if (data && data.repos) {
      displayProjects(data.repos)
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    document.getElementById('projects-container').innerHTML = `
      <div class="error">
        <p>Failed to load projects. Please try again later.</p>
      </div>
    `
  }
}

function updateUserInfo(user) {
  if (user.name) {
    document.getElementById('user-name').textContent = user.name
  }

  if (user.bio) {
    document.getElementById('user-bio').textContent = user.bio
  }

  if (user.avatar_url) {
    document.getElementById('user-avatar').src = user.avatar_url
  }

  if (user.location) {
    document.getElementById('user-location').textContent = user.location
  }

  document.getElementById('repos-count').textContent = user.public_repos || 0
  document.getElementById('followers-count').textContent = user.followers || 0
  document.getElementById('following-count').textContent = user.following || 0
}

function displayProjects(repos) {
  const projectsContainer = document.getElementById('projects-container')

  if (!repos || repos.length === 0) {
    projectsContainer.innerHTML = '<p>No projects found.</p>'
    return
  }

  let projectsHTML = ''

  repos.forEach(repo => {
    const languageClass = repo.language ? 
      `project-language language-${repo.language.toLowerCase().replace(/[^a-z0-9]/g, '')}` : 
      'project-language language-none'

    projectsHTML += `
      <div class="project-card">
        <div class="project-content">
          <h3 class="project-title">${repo.name}</h3>
          <p class="project-description">${repo.description || 'No description available'}</p>
          <div class="project-meta">
            ${repo.language ? 
              `<div class="${languageClass}">${repo.language}</div>` : 
              '<div class="project-language language-none">N/A</div>'
            }
            <div class="project-stats">
              <span><i class="fas fa-star"></i> ${repo.stars || 0}</span>
              <span><i class="fas fa-code-branch"></i> ${repo.forks || 0}</span>
            </div>
          </div>
        </div>
      </div>
    `
  })

  projectsContainer.innerHTML = projectsHTML

  const projectCards = document.querySelectorAll('.project-card')
  projectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      window.open(repos[index].url, '_blank')
    })
  })
}

function isElementInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

function animateOnScroll() {
  const elements = document.querySelectorAll('.skill-item, .project-card, .stat')

  elements.forEach(element => {
    if (isElementInViewport(element) && !element.classList.contains('animated')) {
      element.classList.add('animated')
      element.style.animation = 'fadeInUp 0.5s ease forwards'
      element.style.opacity = '1'
    }
  })
}

window.addEventListener('scroll', animateOnScroll)
window.addEventListener('load', animateOnScroll)

const style = document.createElement('style')
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0
      transform: translateY(20px)
    }
    to {
      opacity: 1
      transform: translateY(0)
    }
  }

  .skill-item, .project-card, .stat {
    opacity: 0
  }
`
document.head.appendChild(style)
