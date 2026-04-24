import { useState } from 'react'
import './AddChannel.css'

export default function AddChannel({ onAdd, onClose }) {
  const [username, setUsername] = useState('')
  const [category, setCategory] = useState('politics')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const clean = username.replace(/^@/, '').trim()
    if (!clean) {
      setError('Введите username канала')
      return
    }
    if (!/^[a-zA-Z0-9_]{4,}$/.test(clean)) {
      setError('Некорректный username (мин. 4 символа, только a-z, 0-9, _)')
      return
    }
    onAdd({ username: clean, category })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Добавить канал</h2>
          <button className="modal__close" onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username канала</label>
            <div className="input-wrapper">
              <span className="input-prefix">@</span>
              <input
                className="form-input"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Категория</label>
            <div className="category-select">
              {[
                { id: 'politics', label: '🏛️ Политика' },
                { id: 'economics', label: '📈 Экономика' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-option${category === cat.id ? ' category-option--active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-submit" type="submit">
            Добавить канал
          </button>
        </form>
      </div>
    </div>
  )
}
