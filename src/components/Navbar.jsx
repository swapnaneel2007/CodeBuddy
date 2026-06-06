import React from 'react'
import { BotMessageSquare, Sun } from 'lucide-react';


const Navbar = () => {
  return (
    <>
      <div className="nav flex items-center justify-between px-[150 px] h-[100 px] bg-zinc-800" style={{padding:"0px 80px"}}>
        <div className="logo flex items-center gap-[10px]">
            <BotMessageSquare size={60} color='oklch(57.7% 0.245 27.325)' />
            <span className="text-2*l font-bold text-white ml-2">CodeBuddy</span>
        </div>
        <div className="icon flex items-center gap-[20px]"></div>
        <i className='cursor-pointer transition-all hover:text-red-500'><Sun/></i>
      </div>
    </>
  )
}
export default Navbar