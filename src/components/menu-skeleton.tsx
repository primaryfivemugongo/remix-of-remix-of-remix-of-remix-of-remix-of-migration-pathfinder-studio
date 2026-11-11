export function MenuSkeleton() {
  return (
    <div className="menu-skeleton" role="status" aria-label="Loading menu options">
      <div aria-hidden="true">
        <div className="menu-skeleton__title" />
        <div className="menu-skeleton__instruction" />
        <div className="menu-skeleton__options">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="menu-skeleton__option" key={index}>
              <div className="menu-skeleton__label" />
              <span className="menu-skeleton__caret" />
            </div>
          ))}
        </div>
        <div className="menu-skeleton__return" />
      </div>
    </div>
  );
}