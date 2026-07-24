import { Alert } from '@mui/material'

// Notifikaatiot näyttävä komponentti
const Notification = ({ message, type }) => {
  // Jos viestiä ei ole, komponentti ei näytä mitään
  if (message === null) {
    return null
  }

  // type on joko 'success' tai 'error' {type}
  return (
    <Alert severity={type} sx={{ mt: 1, mb: 1 }}>
      {message}
    </Alert>
  )
}

export default Notification