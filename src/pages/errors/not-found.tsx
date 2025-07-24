import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
  }
  return (
    <div>
      Not Found

      <div>
        <button onClick={goBack} type="button">
        </button>
      </div>
    </div>
  )
}
