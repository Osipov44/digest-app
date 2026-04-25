import { useState } from 'react'
import { formatTime, formatViews } from '../utils/formatTime'
import './PostCard.css'

const API_BASE = 'https://web-production-69775.up.railway.app'

const CATEGORY_LABEL = { politics: 'Политика', economics: 'Экономика' }

function ChannelAvatar({ username, fallback }) {
  const [useFallback, setUseFallback] = useState(false)

  if (useFallback) {
    return <div className="post-card__avatar post-card__avatar--emoji">{fallback}</div>
  }

  return (
    <img
      className="post-card__avatar post-card__avatar--img"
      src={`${API_BASE}/channel-photo?username=${username}`}
      alt={username}
      onError={() => setUseFallback(true)}
    />
  )
}

export default function PostCard({ post }) {
  const { message_id, channel, avatar, username, time, text, views, category, media_type } = post
  const categoryLabel = CATEGORY_LABEL[category]
  const hasImage = media_type === 'photo'

  return (
    <article className="post-card">
      <div className="post-card__header">
        <ChannelAvatar username={username} fallback={avatar} />
        <div className="post-card__meta">
          <span className="post-card__channel">{channel}</span>
          <span className="post-card__username">@{username}</span>
        </div>
        <div className="post-card__right">
          {categoryLabel && (
            <span className={`post-card__badge post-card__badge--${category}`}>
              {categoryLabel}
            </span>
          )}
          <span className="post-card__time">{formatTime(time)}</span>
        </div>
      </div>

      {hasImage && (
        <div className="post-card__image-wrap">
          <img
            className="post-card__image"
            src={`${API_BASE}/media?channel=${username}&message_id=${message_id}`}
            alt="media"
            loading="lazy"
          />
        </div>
      )}

      {text && <p className="post-card__text">{text}</p>}

      <div className="post-card__footer">
        <span className="post-card__views">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {formatViews(views)}
        </span>
        <button className="post-card__open" aria-label="Открыть в Telegram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Открыть
        </button>
      </div>
    </article>
  )
}
