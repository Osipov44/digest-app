import './ManageChannels.css'

const CATEGORY_LABEL = { politics: 'Политика', economics: 'Экономика' }

export default function ManageChannels({ channelMeta, onDelete, onClose }) {
  const channels = Object.entries(channelMeta)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal manage-modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Каналы</h2>
          <button className="modal__close" onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {channels.length === 0 ? (
          <p className="manage-empty">Нет добавленных каналов</p>
        ) : (
          <ul className="manage-list">
            {channels.map(([username, meta]) => (
              <li key={username} className="manage-item">
                <div className="manage-item__avatar">{meta.avatar}</div>
                <div className="manage-item__info">
                  <span className="manage-item__name">{meta.name || `@${username}`}</span>
                  <div className="manage-item__sub">
                    <span className="manage-item__username">@{username}</span>
                    {meta.category && (
                      <span className={`manage-item__badge manage-item__badge--${meta.category}`}>
                        {CATEGORY_LABEL[meta.category]}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="manage-item__delete"
                  onClick={() => onDelete(username)}
                  aria-label={`Удалить @${username}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="manage-hint">Каналы сохраняются между сессиями</p>
      </div>
    </div>
  )
}
