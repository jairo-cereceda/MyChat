import Record from '../../molecules/record';
import './header.css';
import { IoMdMenu } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { BiSolidPencil } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { RiStarFill } from 'react-icons/ri';
import { RiStarOffLine } from 'react-icons/ri';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { type ChatData, type MessageData } from '../../../types';
import HeaderButton from '../../atoms/header-button';

interface HeaderProps {
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onImportExport: () => void;
  onDeleteMessage: (id: string) => void;
  onEdit: (msg: MessageData) => void;
  onStar: (msg: MessageData) => void;
  onWatchStarred: () => void;
  chats: ChatData[];
  mode?: string;
  openMenuId: string;
  setOpenMenuId: (id: string) => void;
  selectedMessage: MessageData | undefined;
  isStarredView: boolean;
}

function Header({
  onCreateChat,
  onDeleteChat,
  onSelectChat,
  onDeleteMessage,
  onImportExport,
  onEdit,
  onStar,
  onWatchStarred,
  isStarredView,
  mode,
  chats,
  openMenuId,
  setOpenMenuId,
  selectedMessage,
}: HeaderProps) {
  return (
    <header className="bg-primary sticky z-30 w-full">
      <div className="py-2 mx-2">
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
              icon={
                selectedMessage && selectedMessage.isStarred
                  ? IoStar
                  : IoStarOutline
              }
              onStar={() => {
                if (selectedMessage) {
                  onStar(selectedMessage);
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
            <div className="flex justify-between">
              <HeaderButton isPopoverOpener={true} icon={IoMdMenu} />
              <HeaderButton
                icon={isStarredView ? RiStarOffLine : RiStarFill}
                onWatchStarred={() => {
                  onWatchStarred();
                }}
              />
            </div>

            <Record
              chats={chats}
              onDeleteChat={onDeleteChat}
              onImportExport={onImportExport}
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
