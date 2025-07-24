import { useNavigate } from 'react-router-dom'

//TODO: implement this component
export const ErrorBoundaryFallback = () =>
  // {}: FallbackProps
  {
    const navigate = useNavigate()

    const handlePushToHome = () => {
      navigate('/')
    }

    return (
      <div>
        <h1>TODO: Something went wrong.</h1>
        <button onClick={handlePushToHome}>Go to Home</button>
      </div>
    )
  }
