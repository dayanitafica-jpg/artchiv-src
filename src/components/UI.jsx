import Logo from './Logo.jsx';

export function LoadingScreen({ hidden }) {
  return (
    <div id="loading" className={hidden ? 'hidden' : ''} style={hidden ? { display: 'none' } : undefined}>
      <div className="ltitle">
        <Logo size={26} color="#C8102E" />
        art<span>Chiv</span>
      </div>
      <div className="lbartrack">
        <div className="lbar" style={{ width: '100%' }} />
      </div>
      <div className="lcaption">La creatividad tiene historia</div>
    </div>
  );
}

export function Header({ view, onNavigate }) {
  return (
    <header className="bar">
      <div className="logo">
        <Logo size={20} color="#C8102E" />
        art<span>Chiv</span>
      </div>
      <nav className="links">
        <button className={`navlink ${view === 'hall' ? 'active' : ''}`} onClick={() => onNavigate('hall')}>
          Sala Central
        </button>
        <button className={`navlink ${view === 'library' ? 'active' : ''}`} onClick={() => onNavigate('library')}>
          Biblioteca
        </button>
        <button className={`navlink ${view === 'archive' ? 'active' : ''}`} onClick={() => onNavigate('archive')}>
          Archivo
        </button>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="channel">
          Canal ↗
        </a>
      </nav>
    </header>
  );
}

export function Breadcrumb({ view }) {
  const label = view === 'hall' ? 'Sala central' : view === 'library' ? 'Pasillo 1 · Biblioteca' : 'Pasillo 2 · Archivo';
  return (
    <div className="breadcrumb">
      <span>artChiv</span>
      <span className="sep">/</span>
      <span className="here">{label}</span>
    </div>
  );
}

export function Filters({ categories, activeFilter, setActiveFilter }) {
  return (
    <div className="filters">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`chip ${activeFilter === cat ? 'on' : ''}`}
          onClick={() => setActiveFilter(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export function Hint({ text, hidden }) {
  return <div className={`hint ${hidden ? 'hidden' : ''}`}>{text}</div>;
}

export function DetailPanel({ doc, onClose }) {
  const open = Boolean(doc);
  return (
    <>
      <div className={`dim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`panel ${open ? 'open' : ''}`}>
        {doc && (
          <>
            <div className="tag" style={{ background: doc.tone }}>
              {doc.category}
            </div>
            <h2>{doc.title}</h2>
            <p>{doc.body}</p>
            <div className="actions">
              <a
                className="watch"
                style={{ color: doc.tone, borderBottomColor: doc.tone }}
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver episodio →
              </a>
              <button className="close" onClick={onClose}>
                Cerrar ×
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function ReturnPrompt({ onReturn }) {
  return (
    <div className="return-prompt">
      <button onClick={onReturn}>← Volver a la Sala Central</button>
    </div>
  );
}
