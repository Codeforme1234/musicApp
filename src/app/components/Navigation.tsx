import React from "react";
import Image from "next/image";
import { right, left, dots, menu } from "@/public";
import { CollapsedPlaylist, CollapsedSidebar } from "../state/Collapse";
import { useRecoilState } from "recoil";

interface PlaylistmenuProps {}
const Navigation: React.FC<PlaylistmenuProps> = ({}) => {
  const [collapsed, setCollapsed] = useRecoilState(CollapsedSidebar);
  const [collapsedPlaylist, setCollapsedPlaylist] =
    useRecoilState(CollapsedPlaylist);

  const handlePlaylistClick = () => {
    setCollapsedPlaylist(!collapsedPlaylist);
  };

  const handleSidebarClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`w-full h-full flex pt-3 gap-3 justify-center items-center`}>
      <div className="w-1/8 flex gap-2 ">
        <button className="lg:hidden block" onClick={handleSidebarClick}>
          <Image src={left} alt="left" />
        </button>
        <div className="lg:block hidden">
          <Image src={left} alt="left" />
        </div>
        <div>
          <Image src={right} alt="right" />
        </div>
      </div>
      <div className="round w-full  ">
        <div className="relative py-3  rounded-3xl w-full max-w-4xl">
          <input
            type="text"
            className="rounded-3xl p-3 w-full text-black placeholder:w-[80%] md:placeholder:w-full"
            placeholder="Search here..."
          />

          <button type="submit" className="absolute right-6 top-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </div>
      <button className="w-1/8 lg:block hidden">
        {" "}
        <Image src={dots} alt="menu" />{" "}
      </button>
      <button className="w-1/8 lg:hidden block" onClick={handlePlaylistClick}>
        <Image src={menu} alt="menu" />{" "}
      </button>
    </div>
  );
};

export default Navigation;
