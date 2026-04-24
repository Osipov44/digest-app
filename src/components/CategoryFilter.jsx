import './CategoryFilter.css'

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-btn${active === cat.id ? ' category-btn--active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
