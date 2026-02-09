import Record from '../../molecules/record';
import './header.css';
import { IoMdMenu } from 'react-icons/io';
import { type ChatData } from '../../../App';

interface HeaderProps {
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  chats: ChatData[];
}

function Header({
  onCreateChat,
  onDeleteChat,
  onSelectChat,
  chats,
}: HeaderProps) {
  return (
    <header className="bg-primary sticky z-30 w-full">
      <div className="py-2 ml-2">
        <button
          popoverTarget="record"
          className="text-text-color p-2 rounded-lg hover:bg-secondary"
        >
          <IoMdMenu size={30} />
        </button>
      </div>
      <Record
        chats={chats}
        onDeleteChat={onDeleteChat}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
      />
    </header>
  );
}

export default Header;
