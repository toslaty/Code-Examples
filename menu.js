import React from "react";
import Link from "next/link";

function Upper_menu(){

    const toggleMenu = () =>{
        var menu = document.getElementById('menu')
        menu.classList.toggle('hidden');
        menu.classList.toggle('w-full');
        menu.classList.toggle('h-screen');
        menu.classList.toggle('mt-28')
    }

    return(
    <>
    <div className="grid grid-cols-3 m-8">
        <div>
            <img id="logo" className='h-24 m-4' src='http://localhost:3000/glow.png'></img> 
        </div>
        <div className="place-content-center">
            <nav id='menu' className="hidden md:flex md:bg-transparent">
                <Link href="/" className="block sm:text-xl text-menuColor font-bold md:ml-4 m-4 p-8 drop-shadow-xl md:text-3xl">Home</Link>
                <Link href="/" className="block sm:text-xl text-menuColor font-bold md:ml-4 m-4 p-8 drop-shadow-xl md:text-3xl">Second</Link>
                <Link href="/" className="block sm:text-xl text-menuColor font-bold md:ml-4 m-4 p-8 drop-shadow-xl md:text-3xl">Third</Link>
            </nav> 
        </div>
    </div>         
    <div className="p-2 mt-12 flex md:hidden">
        <button className="top-6 mt-16 fixed right-6 text-5xl text-menuColor font-bold opacity-80" onClick={toggleMenu}>&#9776;</button>
    </div>
    </> 
    )
}
export default Upper_menu