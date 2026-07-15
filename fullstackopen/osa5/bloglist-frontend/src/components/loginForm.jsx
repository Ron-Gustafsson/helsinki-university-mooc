// Kirjautumis lomakkeen komponentti
const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username:
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="enter your username"
          />
        </label>
      </div>

      <div>
        <label>
          password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="enter your password"
          />
        </label>
      </div>

      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm