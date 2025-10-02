import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../store/userSlice';

const Profile = () => {
  const profileData = useSelector(state => state.user?.userInfo);
  const [isEditProfile, setIsEditProfile] = React.useState(false);
  const [changeData, setChangeData] = React.useState({
    name: profileData?.name || '',
    avatar: profileData?.avatar?.cloudinaryAvatarUrl || '',
    email: profileData?.email || '',
    username: profileData?.username || ''
  });
  const token = useSelector(state => state.user?.token);
  const dispatch = useDispatch();

  const handleChange = (e) => {
      setChangeData({
        ...changeData,
        [e.target.name]: e.target.value
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_API}/users/edit-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(changeData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setIsEditProfile(false);
  }

  useEffect(() => {
   const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_API}/users/profile`, {
          method: 'GET',
          headers: {  
              "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();  
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        } 
        setChangeData({
          name: data.user?.name || '',
          avatar: data.user?.avatar?.cloudinaryAvatarUrl || '',
          email: data.user?.email || '',
          username: data.user?.username || ''
        });

        dispatch(setUser({ userInfo: data.user, token: token }));
      } catch (error) {
        console.error('Error fetching profile:', error);      } 
    }
      fetchProfile();
  }, [isEditProfile])

  return (
    <div className='container mx-auto p-4'>
      {isEditProfile ? (
          <form
            className="border border-white/30 px-6 py-10 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl shadow-black/40 flex flex-col gap-6 mt-8"
            onSubmit={handleSubmit}
          >         
           <div>
            <label htmlFor="name">Name: </label>
            <input
              className='border px-2 py-1 rounded'
              onChange={handleChange}
              type="text"
              id="name"
              name="name"
              value={changeData.name}
            />
          </div>

          <div>
            <label htmlFor="username">Username: </label>
            <input
              className='border px-2 py-1 rounded'
              onChange={handleChange}
              type="text"
              id="username"
              name="username"
              value={changeData.username}
            />
          </div>

          <div>
            <label htmlFor="email">Email: </label>
            <input
              className='border px-2 py-1 rounded'
              onChange={handleChange}
              type="email"
              id="email"
              name="email"
              value={changeData.email}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsEditProfile(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="relative border-2 px-4 py-12 bg-white rounded-xl shadow-2xl shadow-gray-700/60 hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center mt-10">
          <button
            onClick={() => setIsEditProfile(true)}
            className='absolute top-1 md:top-4 right-1 md:right-4 px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800'
          >
            Edit Profile
          </button>
          <h3 className='text-2xl font-bold mb-4'>
            {profileData?.name}
          </h3>
          <div>
            <img
              className='w-32 h-32 rounded-full object-cover mb-4'
              src={profileData?.avatar?.cloudinaryAvatarUrl}
              alt="Profile"
            />
          </div>
          <p className='font-semibold'>{profileData?.username}</p>
          <p className='font-semibold'>{profileData?.email}</p>
        </div>
      )}
    </div>
  )
}

export default Profile;
