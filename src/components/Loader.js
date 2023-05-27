
import ClipLoader from "react-spinners/ClipLoader"

const Loader = ({loading}) => {
  return (
    <ClipLoader
        loading={loading}
        size={40}
        className="loading"
        />
  )
}
export default Loader