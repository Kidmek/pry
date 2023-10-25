import { useEffect, useState } from 'react'
import './App.css'
import { operations } from './constants'
import { useQuery } from 'react-query'
import { CategoryType, fetchCategories } from './api/suggestions'

function App() {
  const [inputs, setInputs] = useState<string[]>([''])
  const [chosen, setChosen] = useState<CategoryType[]>([])
  const [insideInput, setInsideInput] = useState<string[]>([''])
  const [focused, setFocused] = useState(0)

  const { data: categories } = useQuery<CategoryType>(
    [
      'categories',
      {
        query:
          inputs[focused] && operations.includes(inputs[focused].charAt(0))
            ? inputs[focused].substring(1, inputs[focused].length)
            : inputs[focused],
      },
    ],
    fetchCategories,
    {
      // only fetch search terms longer than 2 characters
      enabled: inputs[focused]?.length > 2,
      // refresh cache after 10 seconds (watch the network tab!)
      staleTime: 10 * 1000,
    }
  )

  useEffect(() => {
    console.log(categories)
  }, [categories])

  return (
    <div>
      <div className='container main'>
        {/* BASE CASE */}
        <div>
          <input
            className='singleInput'
            style={{
              width: `${inputs.length > 1 ? inputs[0].length + 1 : 100}ch `,
            }}
            onFocus={() => setFocused(0)}
            value={inputs[0]}
            onChange={(e) => {
              const prevInput = inputs
              prevInput[0] = e.target.value
              setInputs([...prevInput])
            }}
          />

          {inputs[0]?.length > 1 &&
            (categories as CategoryType[]) &&
            (categories as CategoryType[]).length > 0 && (
              <div className='list'>
                {(categories as CategoryType[])?.map((category, index) => (
                  <div
                    key={index}
                    className='option'
                    onClick={() => {
                      const prevInput = inputs
                      prevInput[0] = ''
                      setChosen([...chosen, category])
                      setInputs(['', ...prevInput])
                    }}
                  >
                    {category.category}
                  </div>
                ))}
              </div>
            )}
        </div>
        {chosen.map((single, mainIndex) => (
          <div key={mainIndex} className='container'>
            {/* SINGLE CHOSEN */}
            <div className='chosen'>
              <div>{single.category}</div>
              <div className='divider' />
              <span>{'['}</span>
              <input
                className='insideInput'
                style={{ width: `${insideInput.length + 0.2}ch ` }}
                value={insideInput}
                onChange={(e) => {
                  const prevInInput = insideInput
                  prevInInput[mainIndex] = e.target.value
                  setInsideInput([...prevInInput])
                }}
              />
              <span>{']'}</span>
            </div>
            {/* NEXT TO CHOSEN */}
            <div>
              <input
                className='singleInput'
                style={{ width: `${inputs[mainIndex + 1].length + 1}ch ` }}
                onFocus={() => setFocused(mainIndex + 1)}
                onKeyDown={(e) => {
                  if (
                    e.key == 'Backspace' &&
                    inputs[mainIndex + 1].length == 0
                  ) {
                    const prevInputs = inputs
                    const prevChosen = chosen
                    prevInputs.splice(mainIndex + 1, 1)
                    prevChosen.splice(mainIndex, 1)
                    setChosen([...prevChosen])
                    setInputs([...prevInputs])
                  }
                }}
                value={inputs[mainIndex + 1]}
                onChange={(e) => {
                  const prevInput = inputs
                  prevInput[mainIndex + 1] = e.target.value
                  setInputs([...prevInput])
                }}
              />

              {inputs[mainIndex + 1].length > 1 &&
                (categories as CategoryType[]) &&
                (categories as CategoryType[]).length > 0 && (
                  <div className='list'>
                    {(categories as CategoryType[])?.map((category, index) => (
                      <div
                        key={index}
                        className='option'
                        onClick={() => {
                          const prevInputs = inputs
                          const firstChar = prevInputs[mainIndex + 1].charAt(0)
                          if (operations.includes(firstChar)) {
                            prevInputs[mainIndex + 1] = firstChar
                          } else {
                            prevInputs[mainIndex + 1] = ''
                          }
                          setChosen([...chosen, category])
                          setInputs([...prevInputs, ''])
                        }}
                      >
                        {category.category}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
