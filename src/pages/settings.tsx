export const Settings = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <div>
      <h1>Settings Page</h1>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={theme === 'dark' ? 'switchCheckDefault' : 'switchCheckChecked'}
          onChange={toggleTheme}
        />
        <label className="form-check-label" htmlFor="switchCheckDefault">
          Switch to {theme === 'dark' ? 'light' : 'dark'} theme
        </label>
      </div>
    </div>
  )
}