// Kirjautumis lomakkeen komponentti
import { TextField, Button } from '@mui/material'

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
        <TextField
          label='username'
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="enter your username"
          size='small'
          sx={{ width: 220, mb: 1 }}
        />
      </div>

      <div>
        <TextField
          label='password'
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="enter your password"
          size='small'
          sx={{ width: 220 }}
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 1 }}
      >
          login
      </Button>
    </form>
  )
}

export default LoginForm