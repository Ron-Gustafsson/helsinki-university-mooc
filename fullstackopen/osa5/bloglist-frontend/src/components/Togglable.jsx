// Komponentin toiminta näyttää ensin nappi, kun nappia painetaan, näyttää sisältö, näyttää cancel-nappi, cancel piilottaa sisällön uudestaan
import { useImperativeHandle, useState, forwardRef } from 'react'

const Togglable = forwardRef((props, refs) => {
  // visible kertoo, näytetäänkö lomake vai pelkkä avausnappi
  const [visible, setVisible] = useState(false)

  // Kun visible on true, avausnappi piilotetaan
  const hideWhenVisible = { display: visible ? 'none' : '' }

  // Kun visible on false, sisältö piilotetaan
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    // Vaihtaa näkyvyyden päinvastaiseksi
    setVisible(!visible)
  }

  // Annetaan Appille lupa kutsua toggleVisibility- funktiota
  useImperativeHandle(refs, () => { // useImperativeHandle React hookki, jonka avulla komponentille voi määrittää funktioita kutsuttavaksi ulkopuolelta
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

// Komponentin nimeäminen -> näkyy selkeämmin react devtools
Togglable.displayName = 'Togglable'

export default Togglable