import avatar from '../assets/avatar.png';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setPage } from '../features/state/globalState';
import MobileNavbar from './MobileNavbar';
export default function Navbar({ callSend, socket }) {
  const name = useSelector((state) => state.global.name);
  const token = useSelector((state) => state.global.token);
  const connectedUsers = useSelector((state) => state.global.connectedUsers);

  const dispatch = useDispatch();
  return (
    <>
      <MobileNavbar socket={socket} callSend={callSend} />
    </>
  );
}
