import Toast from "Components/Layout/Toast"
import axios from "axios"

export const moviesNowShowing = async () => {
    try {
        const { data: { movie } } = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/movie/with-future-show`
        )
        return movie
    } catch (err) {
        Toast.error('Cannot get movies', 'top-right');
        return [];
    }
}

export const allMovies = () => {

}