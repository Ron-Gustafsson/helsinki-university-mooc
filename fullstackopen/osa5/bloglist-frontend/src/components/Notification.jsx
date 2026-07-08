const Notification = ({ message, type }) => {
  // Jos viestiä ei ole, komponentti ei näytä mitään
  if (message === null) {
    return null
  }

  // type on joko 'success' tai 'error'
  return (
    <div className={type}>
      {message}
    </div>
  )
}

export default Notification