import DiscoverBooks from './sections/DiscoverBooks'
import { useState } from 'react'
import './App.css'
import LibrarySection from './sections/LibrarySection'
import FreeBooksSection from './sections/FreeBooksSection'
import AuthorsSection from './sections/AuthorsSection'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    ['Home', '#home'],
    ['Discover', '#discover'],
    ['Authors', '#authors'],
    ['My Library', '#library'],
    ['Read Free', '#free-books'],
  ]

  return (
    <header className="header">
      <nav className="navbar container">
        <a href="#home" className="logo">
          Literary Archive
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero container" id="home">
      <div className="hero-content">
        <p className="eyebrow">A WORLD BETWEEN THE PAGES</p>

        <h1>
          Discover knowledge.
          <br />
          Find your next story.
        </h1>

        <p className="hero-description">
          Explore academic textbooks, literary works, and
          reading resources. Follow authors and organize
          your reading journey in one place.
        </p>

        <a href="#discover" className="primary-button">
          Explore Books
        </a>
      </div>

      <div className="hero-decoration" aria-hidden="true">
        <div className="hero-book">
          <span>THE ART OF</span>
          <strong>READING</strong>
          <small>Every page holds a story.</small>
        </div>
      </div>
    </section>
  )
}


function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <a href="#home" className="logo">
          Literary Archive<span>.</span>
        </a>
        <p>Your personal academic and reading library.</p>
        <small>© 2026 Literary Archive. All rights reserved.</small>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DiscoverBooks />
        <AuthorsSection />
        <LibrarySection />
        <FreeBooksSection />
      </main>
      <Footer />
    </>
  )
}

export default App
