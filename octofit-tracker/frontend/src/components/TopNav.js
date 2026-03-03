import logo from '../octofitapp-small.png';

function TopNav({ sections, activeSection, onSectionChange }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded-3 shadow-sm mb-4">
      <div className="container-fluid">
        <span className="navbar-brand fw-semibold d-flex align-items-center gap-2">
          <img src={logo} alt="OctoFit" className="octofit-logo" />
          <span>OctoFit Tracker</span>
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#octofitNav"
          aria-controls="octofitNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="octofitNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {sections.map((section) => (
              <li className="nav-item" key={section.id}>
                <button
                  className={`nav-link btn btn-link ${activeSection === section.id ? 'active text-white' : 'text-white-50'}`}
                  onClick={() => onSectionChange(section.id)}
                  type="button"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
          <a className="btn btn-light btn-sm" href="/api/" target="_blank" rel="noreferrer">
            Open API Root
          </a>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
