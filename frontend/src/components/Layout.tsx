import { Link } from "react-router-dom";

type LayoutProps = {
  title?: string;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  document.title = `${title ? title + " :: " : ""}Timetable Generator`;

  return (
    <div>
      <header className="header">
        <div className="header_container">
          <Link to="/" className="nav__logo">
            <h1>Timetable Generator</h1>
          </Link>

          <nav className="nav">
            <div className="nav__container">
              <ul className="nav__list">
                <li className="nav__item">
                  <Link to="/create_timetable" className="nav__link">
                    Timetable
                  </Link>
                </li>
                <li className="nav__item">
                  <Link to="/about" className="nav__link">
                    About
                  </Link>
                </li>
              </ul>

              {/* <div className="nav__close" id="nav-close">
                <i className="ri-close-large-line nav__close-icon"></i>
              </div> */}

              <div className="nav__social">
                <a
                  href="https://github.com/tamunyai/timetable-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav__social-link"
                >
                  <i className="ri-github-line nav__social-icon"></i>
                  <span className="nav__social-text">GitHub</span>
                </a>
              </div>

              <div className="nav__toggle" id="nav-toggle">
                <i className="ri-menu-line nav__toggle-icon"></i>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="main__container">{children}</main>
    </div>
  );
};

export default Layout;
