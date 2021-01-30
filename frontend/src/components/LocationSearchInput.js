import { useState } from 'react'
import Downshift from 'downshift'

import { useLocation } from '../services/location'

function LocationSearchInput(props) {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const {
    error,
    isLoading,
    data: locationResults,
    fetchLocationResults,
  } = useLocation()
  const handleInputChange = (event) => {
    if (!event.target.value) {
      return
    }
    fetchLocationResults(event.target.value)
  }
  const handleDownshiftOnChange = (selectedResult) => {
    setSelectedPlace(selectedResult)
    props.onChangeValue(selectedResult)
  }
  console.log(selectedPlace)
  return (
    <>
      <Downshift
        onChange={handleDownshiftOnChange}
        itemToString={(item) => (item ? item.description : '')}
      >
        {({
          selectedItem,
          getInputProps,
          getItemProps,
          //getLabelProps,
          getMenuProps,
          clearSelection,
          highlightedIndex,
          isOpen,
          inputValue,
        }) => {
          return (
            <div className={'w-full'}>
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Name, address, etc...',
                    onChange: handleInputChange,
                  })}
                  type={'text'}
                  className={'px-4 w-full text-black dark:text-black'}
                />
                {selectedItem ? (
                  <button onClick={clearSelection} aria-label='clear selection'>
                    X
                  </button>
                ) : (
                  <></>
                )}
              </div>
              {isOpen && (
                <ul
                  style={{
                    padding: 0,
                    marginTop: 0,
                    position: 'absolute',
                    backgroundColor: 'white',
                    width: '100%',
                    maxHeight: '20rem',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    outline: '0',
                    transition: 'opacity .1s ease',
                    borderRadius: '0 0 .28571429rem .28571429rem',
                    boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
                    borderColor: '#96c8da',
                    borderTopWidth: '0',
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderLeftWidth: 1,
                    borderStyle: 'solid',
                  }}
                  className={'text-black'}
                  {...getMenuProps({ isOpen })}
                >
                  {isLoading && <div disabled>Loading...</div>}
                  {error && <div disabled>Error!</div>}
                  {!isLoading && !error && !locationResults.length && (
                    <div>No results returned</div>
                  )}
                  {inputValue &&
                    locationResults.length > 0 &&
                    locationResults.slice(0, 10).map((item, index) => (
                      <div
                        key={index}
                        {...getItemProps({
                          key: index,
                          index,
                          item,
                          isActive: highlightedIndex === index,
                          isSelected: selectedItem === item,
                        })}
                        className={'text-black dark:text-black'}
                        style={{
                          backgroundColor:
                            highlightedIndex === index ? 'lightgray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                        }}
                      >
                        <p className={'text-black dark:text-black'}>
                          {item.description}
                        </p>
                      </div>
                    ))}
                </ul>
              )}
            </div>
          )
        }}
      </Downshift>
    </>
  )
}

export default LocationSearchInput
