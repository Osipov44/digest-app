import { useState } from 'react'
import { formatTime, formatViews } from '../utils/formatTime'
import Lightbox from './Lightbox'
import './PostCard.css'

const API_BASE = 'https://web-production-69775.up.railway.app'
const CATEGORY_LABEL  = { politics: 'Политика', economics: 'Экономика' }
const SENTIMENT_ICON  = { positive: '😊', negative: '😞', neutral: '😐' }

function ChannelAvatar({ username, fallback }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className="post-card__avatar post-card__avatar--emoji">{fallback}</div>
  }
  return (
    <img
      className="post-card__avatar post-card__avatar--img"
      src={`${API_BASE}/channel-photo?username=${username}`}
      alt={username}
      onError={() => setFailed(true)}
    />
  )
}

function PostMedia({ username, message_id, media_type }) {
  const [failed, setFailed]     = useState(false)
  const [lightbox, setLightbox] = useState(false)

  if (media_type === 'video') {
    return (
      <a
        className="post-card__video-badge"
        href={`https://t.me/${username}/${message_id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        Тут видео
      </a>
    )
  }

  if (media_type === 'photo') {
    if (failed) return null
    const src = `${API_BASE}/media?channel=${username}&message_id=${message_id}`
    return (
      <>
        <div className="post-card__media-wrap">
          <img
            className="post-card__image post-card__image--clickable"
            src={src}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            onClick={() => setLightbox(true)}
          />
        </div>
        {lightbox && <Lightbox src={src} alt="" onClose={() => setLightbox(false)} />}
      </>
    )
  }

  return null
}

export default function PostCard({ post }) {
  const { message_id, channel, avatar, username, time, text, views, category, media_type, sentiment } = post
  const categoryLabel = CATEGORY_LABEL[category]
  const sentimentIcon = SENTIMENT_ICON[sentiment]
  const hasMedia = media_type === 'photo' || media_type === 'video'

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

      {hasMedia && (
        <PostMedia
          username={username}
          message_id={message_id}
          media_type={media_type}
        />
      )}

      {text && <p className="post-card__text">{text}</p>}

      <div className="post-card__footer">
        <div className="post-card__footer-left">
          <span className="post-card__views">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {formatViews(views)}
          </span>
          {sentimentIcon && (
            <span className={`post-card__sentiment post-card__sentiment--${sentiment}`}>
              {sentimentIcon}
            </span>
          )}
        </div>
        {media_type !== 'video' && (
          <a
            className="post-card__open"
            href={`https://t.me/${username}/${message_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Источник
          </a>
        )}
      </div>
    </article>
  )
}
