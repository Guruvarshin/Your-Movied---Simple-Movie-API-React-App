import MovieCard from "../components/MovieCard";
import { useState, useEffect, use } from "react";
import '../css/Home.css';
import { searchMovies, getPopularMovies } from "../services/api";
function Home() {
    const [searchQuery, setSearchQuery] = useState("");

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (error) {
                console.error("Error fetching popular movies:", error);
                setError("Failed to fetch popular movies.");
            }
            finally {
                setLoading(false);
            }
        };
        loadPopularMovies();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return
        if (loading) return

        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to search movies...")
        } finally {
            setLoading(false)
        }
    };

    return <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input type="text" placeholder="Search for a movie..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" className="search-button">Search</button>
        </form>
        {loading ? <div className="loding">Loading...</div> : error ? <div className="error">{error}</div> : (
            <div className="movies-grid">
                {movies.map(movie => (movie.title.toLowerCase().startsWith(searchQuery) && <MovieCard key={movie.id} movie={movie} />))}
            </div>
        )}
    </div>;
}

export default Home;