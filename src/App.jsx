import { useState, useMemo } from 'react'
import { useTelegram } from './hooks/useTelegram'
import { POSTS, CHANNELS, CATEGORIES } from './data/testData'
import PostCard from './components/PostCard'
import CategoryFilter from './components/CategoryFilter'
import AddChannel from './components/AddChannel'
import './App.css'

export default function App() {
  useTelegram()

  const [activeCategory, setActiveCategory] = useState('all')
  const [channels, setChannels] = useState(CHANNELS)
  const [posts, setPosts] = useState(POSTS)
  const [showAddChannel, setShowAddChannel] = useState(false)

  const filteredPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.time - a.time)
    if (activeCategory === 'all') return sorted
    return sorted.filter((p) => p.category === activeCategory)
  }, [posts, activeCategory])

  function handleAddChannel({ username, category }) {
    const avatars = { politics: '🏛️', economics: '📈' }
    const newChannel = {
      id: channels.length + 1,
      username,
      name: `@${username}`,
      category,
      avatar: avatars[category],
    }
    setChannels((prev) => [...prev, newChannel])

    const newPost = {
      id: posts.length + 1,
      channelId: newChannel.id,
      channel: `@${username}`,
      username,
      category,
      avatar: avatars[category],
      time: new Date(),
      text: `Канал @${username} добавлен в ленту. Здесь будут появляться свежие посты.`,
      views: 0,
    }
    setPosts((prev) => [newPost, ...prev])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo">📡</span>
            <h1 className="app-header__title">Digest</h1>
          </div>
          <button
            className="app-header__add"
            onClick={() => setShowAddChannel(true)}
            aria-label="Добавить канал"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </header>

      <main className="app-feed">
        {filteredPosts.length === 0 ? (
          <div className="app-empty">
            <span className="app-empty__icon">📭</span>
            <p className="app-empty__text">Нет постов в этой категории</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </main>

      {showAddChannel && (
        <AddChannel
          onAdd={handleAddChannel}
          onClose={() => setShowAddChannel(false)}
        />
      )}
    </div>
  )
}
