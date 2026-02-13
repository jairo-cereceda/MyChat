import Record from '../../molecules/record';
import './header.css';
import { IoMdMenu } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { BiSolidPencil } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { type ChatData, type MessageData } from '../../../App';
import HeaderButton from '../../atoms/header-button';

interface HeaderProps {
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onEdit: (msg: MessageData) => void;
  chats: ChatData[];
  mode?: string;
  openMenuId: string;
  setOpenMenuId: (id: string) => void;
  selectedMessage: MessageData | undefined;
}

function Header({
  onCreateChat,
  onDeleteChat,
  onSelectChat,
  onDeleteMessage,
  onEdit,
  mode,
  chats,
  openMenuId,
  setOpenMenuId,
  selectedMessage,
}: HeaderProps) {
  return (
    <header className="bg-primary sticky z-30 w-full">
      <div className="py-2 ml-2">
        {mode === 'editing' ? (
          <div className="flex justify-center gap-2">
            <HeaderButton
              icon={MdDelete}
              onDelete={() => {
                onDeleteMessage(openMenuId);
                setOpenMenuId('');
              }}
            />
            <HeaderButton
              icon={BiSolidPencil}
              onEdit={() => {
                if (selectedMessage) {
                  onEdit(selectedMessage);
                  setOpenMenuId('');
                }
              }}
            />
            <HeaderButton
              icon={RxCross2}
              onClose={() => {
                setOpenMenuId('');
              }}
            />
          </div>
        ) : (
          <>
            <HeaderButton icon={IoMdMenu} />

            <Record
              chats={chats}
              onDeleteChat={onDeleteChat}
              onCreateChat={onCreateChat}
              onSelectChat={onSelectChat}
            />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
