import { useEffect, useState } from 'react'
import './App.css'
import { operations } from './constants'
import { useQuery } from 'react-query'
import { CategoryType, fetchCategories } from './api/suggestions'
import { useStore } from './store/useStore'

function App() {
  const [inputs, setInputs] = useState<string[]>([''])

  // Zustand
  const { chosen, setChosen } = useStore()
  const [insideInput, setInsideInput] = useState<string[]>(['x'])
  const [focused, setFocused] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [valid, setValid] = useState<boolean>(true)

  const { data: categories } = useQuery<CategoryType>(
    [
      'categories',
      {
        query:
          inputs[focused] &&
          inputs[focused].length &&
          operations.includes(inputs[focused].charAt(0)) &&
          (inputs[focused].length <= 2 ||
            !operations.includes(inputs[focused].charAt(1)))
            ? inputs[focused].substring(1, inputs[focused].length)
            : inputs[focused] &&
              inputs[focused].length &&
              inputs[focused].length > 1 &&
              operations.includes(inputs[focused].substring(0, 2))
            ? inputs[focused].substring(2, inputs[focused].length)
            : inputs[focused],
      },
    ],
    // @ts-ignore
    fetchCategories,
    {
      // only fetch search terms longer than 2 characters
      enabled: inputs[focused]?.length > 2,
      // refresh cache after 10 seconds (watch the network tab!)
      staleTime: 10 * 1000,
    }
  )

  useEffect(() => {
    if (inputs[0].length > 0) {
      setValid(false)
    } else {
      let total: number = 0
      let next: boolean = true
      let operation: string = ''
      try {
        chosen.forEach((category, index) => {
          if (index == 0) {
            operation = inputs[index + 1]
            total += category.value
          } else {
            switch (operation) {
              case '+':
                total += category.value
                break
              case '-':
                total -= category.value
                break
              case '*':
                total *= category.value
                break
              case '**':
                total **= category.value
                break
              case '^':
                total ^= category.value
                break
              case '/':
                total /= category.value
                break
              case '%':
                total %= category.value
                break
              default:
                next = false
            }
          }
          if (!next) {
            throw new Error('Invalid')
          }
        })
        setValid(true)
        setTotal(total)
      } catch (invalid) {
        setValid(false)
      }
    }
  }, [chosen, inputs])

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
                      const prevInInput = insideInput
                      prevInput[0] = ''
                      setChosen([...chosen, category])
                      setInputs(['', ...prevInput])
                      setInsideInput(['x', ...prevInInput])
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
                style={{ width: `${insideInput[mainIndex].length + 0.2}ch ` }}
                value={insideInput[mainIndex]}
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
                    const prevInInput = insideInput
                    prevInputs.splice(mainIndex + 1, 1)
                    prevChosen.splice(mainIndex, 1)
                    prevInInput.splice(mainIndex, 1)
                    setChosen([...prevChosen])
                    setInputs([...prevInputs])
                    setInsideInput([...prevInInput])
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
                          const prevInInput = insideInput
                          const firstChar = prevInputs[mainIndex + 1].charAt(0)
                          if (operations.includes(firstChar)) {
                            if (
                              prevInputs[mainIndex + 1].length > 1 &&
                              operations.includes(
                                prevInputs[mainIndex + 1].substring(0, 2)
                              )
                            ) {
                              prevInputs[mainIndex + 1] = prevInputs[
                                mainIndex + 1
                              ].substring(0, 2)
                            } else {
                              prevInputs[mainIndex + 1] = firstChar
                            }
                          } else {
                            prevInputs[mainIndex + 1] = ''
                          }
                          setChosen([...chosen, category])
                          setInputs([...prevInputs, ''])
                          setInsideInput([...prevInInput, 'x'])
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
      {valid ? <div>Total : {total}</div> : <div>Syntax Error</div>}
    </div>
  )
}

export default App
