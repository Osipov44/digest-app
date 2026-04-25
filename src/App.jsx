import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTelegram } from './hooks/useTelegram'
import { useLocalStorage } from './hooks/useLocalStorage'
import { CATEGORIES } from './data/testData'
import PostCard from './components/PostCard'
import CategoryFilter from './components/CategoryFilter'
import AddChannel from './components/AddChannel'
import ManageChannels from './components/ManageChannels'
import './App.css'

const API_BASE = 'https://web-production-69775.up.railway.app'

const DEFAULT_CHANNEL_META = {
  rbc_news:   { category: 'economics', avatar: '📈', name: 'РБК' },
  bbcrussian: { category: 'politics',  avatar: '📰', name: 'BBC Русская служба' },
  rian_ru:    { category: 'politics',  avatar: '🗞️', name: 'РИА Новости' },
}

function normalizePost(raw, channelMeta) {
  const username = raw.channel_username
  const meta = channelMeta[username] ?? {}
  return {
    id:       `${username}_${raw.id}`,
    channel:  raw.channel_name || meta.name || username,
    username,
    category: meta.category ?? null,
    avatar:   meta.avatar ?? '📰',
    time:     new Date(raw.date),
    text:     raw.text,
    views:    raw.views ?? 0,
  }
}

export default function App() {
  useTelegram()

  const [channelMeta, setChannelMeta] = useLocalStorage('digest:channels', DEFAULT_CHANNEL_META)
  const [posts, setPosts]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAddChannel, setShowAddChannel] = useState(false)
  const [showManage, setShowManage]         = useState(false)

  const fetchPosts = useCallback(async (meta = channelMeta) => {
    const usernames = Object.keys(meta)
    if (usernames.length === 0) {
      setPosts([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const params = usernames.map(u => `@${u}`).join(',')
      const res = await fetch(
        `${API_BASE}/posts?channels=${encodeURIComponent(params)}&limit=10`
      )
      if (!res.ok) throw new Error(`Ошибка сервера ${res.status}`)
      const data = await res.json()
      setPosts(data.posts.map(p => normalizePost(p, meta)))
      if (data.errors?.length) console.warn('API partial errors:', data.errors)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [channelMeta])

  useEffect(() => { fetchPosts() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleAddChannel({ username, category }) {
    const avatars = { politics: '🏛️', economics: '📈' }
    const newMeta = {
      ...channelMeta,
      [username]: { category, avatar: avatars[category], name: `@${username}` },
    }
    setChannelMeta(newMeta)
    fetchPosts(newMeta)
    setShowAddChannel(false)
  }

  function handleDeleteChannel(username) {
    const newMeta = { ...channelMeta }
    delete newMeta[username]
    setChannelMeta(newMeta)
    setPosts(prev => prev.filter(p => p.username !== username))
  }

  const filteredPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.time - a.time)
    if (activeCategory === 'all') return sorted
    return sorted.filter(p => p.category === activeCategory)
  }, [posts, activeCategory])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo">📡</span>
            <h1 className="app-header__title">Digest</h1>
          </div>
          <div className="app-header__actions">
            <button
              className="app-header__refresh"
              onClick={() => fetchPosts()}
              disabled={loading}
              aria-label="Обновить"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                className={loading ? 'spin' : ''}>
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>
            <button
              className="app-header__manage"
              onClick={() => setShowManage(true)}
              aria-label="Управление каналами"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button
              className="app-header__add"
              onClick={() => setShowAddChannel(true)}
              aria-label="Добавить канал"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </header>

      <main className="app-feed">
        {loading && posts.length === 0 ? (
          <div className="app-spinner">
            <svg className="spinner" viewBox="0 0 50 50" width="40" height="40">
              <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent)"
                strokeWidth="4" strokeLinecap="round" strokeDasharray="90 60" />
            </svg>
            <p className="app-spinner__text">Загружаем посты…</p>
          </div>
        ) : error ? (
          <div className="app-error">
            <span className="app-error__icon">⚠️</span>
            <p className="app-error__text">Не удалось загрузить посты</p>
            <p className="app-error__detail">{error}</p>
            <button className="app-error__retry" onClick={() => fetchPosts()}>
              Попробовать снова
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="app-empty">
            <span className="app-empty__icon">📭</span>
            <p className="app-empty__text">
              {Object.keys(channelMeta).length === 0
                ? 'Добавьте каналы через кнопку +'
                : 'Нет постов в этой категории'}
            </p>
          </div>
        ) : (
          filteredPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </main>

      {showAddChannel && (
        <AddChannel
          onAdd={handleAddChannel}
          onClose={() => setShowAddChannel(false)}
        />
      )}

      {showManage && (
        <ManageChannels
          channelMeta={channelMeta}
          onDelete={handleDeleteChannel}
          onClose={() => setShowManage(false)}
        />
      )}
    </div>
  )
}
