import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import '../../styles/saved.css'
import ReelFeed from '../../components/ReelFeed'
import { useNavigate } from 'react-router'

const Saved = () => {
    const [ videos, setVideos ] = useState([]);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get('https://food-swipe-frontend.onrender.com/api/food/allSave', {
          withCredentials: true,
        })
        const savedFoods = res.data.savedFoods.map((item) => ({
          _id: item.food._id,
          video: item.food.video,
          name: item.food.name,
          description: item.food.description,
        }))
        setVideos(savedFoods)
      } catch (err) {
        console.error('Error fetching saved foods:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [])



    // const removeSaved = async (item) => {
    //     try {
    //         await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
    //         setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
    //     } catch {
    //         // noop
    //     }
    // }

   if (loading) return <div className="loader-container">
    <div className="loader"></div>
  </div> 

   if (videos.length === 0) return <div className='no-saved'>No saved videos yet</div>;
  return (
    <div className="saved-container">
      <h2 className="saved-heading">Saved Videos</h2>

      <div className="saved-grid">
        {videos.map((video, index) => (
          <div
            key={video._id}
            className="saved-card"
            onClick={() => navigate(`/savedReels/${index}`)}
          >
            <video
              src={video.video}
              muted
              loop
              playsInline
              preload="metadata"
              className="saved-video"
            />
            <div className="saved-overlay">
              <p className="saved-title">{video.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )  
    }



export default Saved