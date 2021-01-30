import { useState } from 'react'

import './app.styles.scss'
import LocationSearchInput from './components/LocationSearchInput'

function App() {
  const [location, setLocation] = useState('')

  const handleChangeValue = (e) => {
    e ? setLocation(e.description) : setLocation('')
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-black font-bold rounded-lg border shadow-lg p-10 m-20'>
        <div>
          <LocationSearchInput onChangeValue={handleChangeValue} />
        </div>
        <div>
          Selected:{' '}
          {location && location.length > '' && <span>{location}</span>}
        </div>
      </div>
    </div>
  )
}

export default App
