import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import NotificationDropdown from '../Notification/NotificationDropdown';
const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold">
            DevBoard
          </Link>
          
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;